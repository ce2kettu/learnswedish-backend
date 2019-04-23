import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as requestIp from "request-ip";
import { Request, Response, NextFunction } from "express";
import { UserModel, IUser } from "../user";
import { Config, BadRequestException, UnauthorizedException, InternalServerException } from "../../utils";
import { ITokenData, ITokenPayload } from "../../interfaces/token";
import { API } from "../../utils";
import { AccessLogModel } from "../accessLog";
import { RefreshTokenModel } from "../refreshToken";
// tslint:disable-next-line: max-line-length
import { ILoginCredentials, IRenewToken, IRegisterUser, IChangePassword, IForgotPassword, IAuthenticatedRequest } from "../../interfaces/auth";
import { isBefore, addHours } from "date-fns";
import { PasswordResetModel } from "../passwordReset";
import { ObjectId } from "bson";
import { transformModel } from "../../utils/pretty";

const JWT_EXPIRATION_MINUTES = 60;
const PASSWORD_RESET_VALID_HOURS = 12;

export class AuthController {
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: ILoginCredentials = req.body;

            // find the user with specified email
            const user = await UserModel.findOne({ email: postData.email });

            // no user found
            if (!user) {
                return next(new UnauthorizedException("Wrong email or password"));
            }

            // check if the specified password is valid
            const isValid = await user.comparePassword(postData.password);

            // wrong password
            if (!isValid) {
                return next(new UnauthorizedException("Wrong email or password"));
            }

            // log new access
            await this.logUserAccess(req, user);

            // return access token and user response
            return API.response(res, {
                token: this.generateToken(user),
                user: transformModel(user),
            });
        } catch (err) {
            return next(new InternalServerException(err, "Authentication failed"));
        }
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: IRegisterUser = req.body;
            const userObject = new UserModel({
                username: postData.username,
                email: postData.email,
                password: postData.password,
                firstName: postData.firstName,
                lastName: postData.lastName,
            });

            // save new user
            const user = await userObject.save();

            // log new access
            await this.logUserAccess(req, user);

            // return access token and user response
            return API.response(res, {
                token: this.generateToken(user),
                user: transformModel(user),
            });
        } catch (err) {
            return next(new InternalServerException(err, "Registration failed"));
        }
    }

    public changePassword = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const postData: IChangePassword = req.body;

            const user = req.user;
            const isValid = await user.comparePassword(postData.oldPassword);

            if (!isValid) {
                return next(new UnauthorizedException("Wrong password"));
            }

            // change password
            user.password = postData.newPassword;
            user.save();

            return API.response(res, {
                message: "Password changed",
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: IForgotPassword = req.body;
            const user = await UserModel.findOne({ email: postData.email });

            if (!user) {
                return next(new BadRequestException());
            }

            // save entry in database
            const resetEntry = new PasswordResetModel({
                userId: user._id,
                verification: crypto.randomBytes(40).toString("hex"),
                expiresAt: addHours(Date.now(), PASSWORD_RESET_VALID_HOURS),
                ipRequest: requestIp.getClientIp(req),
                browserRequest: req.headers["user-agent"],
            });

            await resetEntry.save();

            // TODO: send email
            return API.response(res, {
                message: "Email sent",
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public renewToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: IRenewToken = req.body;

            const refreshObject = await RefreshTokenModel.findOne({
                token: postData.refreshToken,
            });

            // token is invalid or has expired
            if (!refreshObject || isBefore(refreshObject.expiresAt, Date.now())) {
                return next(new BadRequestException("Invalid refreshToken"));
            }

            // create new token for the user
            const userId = (refreshObject.userId as ObjectId).toHexString();
            const user = await UserModel.findById(userId);

            if (!user) {
                return next(new InternalServerException());
            }

            return API.response(res, {
                token: this.generateToken(user, true),
            });
        } catch (err) {
            return next(new InternalServerException(err, "Unable to renew token"));
        }
    }

    public logUserAccess = async (req: Request, user: IUser) => {
        return new Promise((resolve, reject) => {
            const logEntry = new AccessLogModel({
                userId: user._id,
                ipAddress: requestIp.getClientIp(req),
                browser: req.headers["user-agent"],
            });

            logEntry.save()
                .then((entry) => resolve(entry))
                .catch((err) => reject(err));
        });
    }

    private generateToken(user: IUser, isRenew: boolean = false): ITokenData {
        const tokenType = "Bearer";
        const refreshToken = isRenew ? undefined : RefreshTokenModel.generate(user).token;
        const expiresIn = JWT_EXPIRATION_MINUTES * 60;
        const payload: ITokenPayload = {
            _id: user._id,
        };

        return {
            tokenType,
            accessToken: jwt.sign(payload, Config.JWT_SECRET, { expiresIn }),
            refreshToken,
            expiresIn,
        };
    }
}
