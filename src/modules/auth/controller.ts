import * as jwt from "jsonwebtoken";
import * as requestIp from "request-ip";
import { Request, Response, NextFunction } from "express";
import { UserModel, User } from "../user";
import { Config, BadRequestException, UnauthorizedException, InternalServerException } from "../../utils";
import { ITokenData, ITokenPayload } from "../../interfaces/token";
import { API } from "../../utils";
import { AccessLogModel } from "../accessLog";
import { RefreshTokenModel } from "../refreshToken";
// tslint:disable-next-line: max-line-length
import { ILoginCredentials, IRenewToken, IRegisterUser, IChangePassword, IForgotPassword, IAuthenticatedRequest } from "../../interfaces/auth";

const JWT_EXPIRATION_IN_MINUTES = 60;

export class AuthController {
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: ILoginCredentials = req.body;

            // TODO: validate request
            if (!(postData.username && postData.password)) {
                return next(new BadRequestException());
            }

            // find the user with specified username
            const user = await UserModel.findOne({ username: postData.username });

            // no user found
            if (!user) {
                return next(new UnauthorizedException("Wrong username or password"));
            }

            // check if the specified password is valid
            const isValid = await user.comparePassword(postData.password);

            if (!isValid) {
                next(new UnauthorizedException("Wrong username or password"));
            }

            // create new token for the user
            const token = this.generateToken(user);

            // log new access
            await this.logUserAccess(req, user);

            // remove passsword property from response
            user.password = undefined;

            return API.response(res, {
                token,
                user,
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: IRegisterUser = req.body;

            // TODO: validate request

            const userObject = new UserModel({
                username: postData.username,
                email: postData.email,
                password: postData.password,
                firstName: postData.firstName,
                lastName: postData.lastName,
            });

            // save new user
            const user = await userObject.save();

            // create new token for the user
            const token = this.generateToken(user);

            // log new access
            await this.logUserAccess(req, user);

            // remove passsword property from response
            user.password = undefined;

            return API.response(res, {
                token,
                user,
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public changePassword = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const postData: IChangePassword = req.body;

            // TODO: validate request
            if (!(postData.oldPassword && postData.newPassword)) {
                return new BadRequestException();
            }

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
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public renewToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: IRenewToken = req.body;

            // TODO: validate request
            if (!postData.refreshToken) {
                return new BadRequestException();
            }

            const userId = postData.refreshToken.split(".")[0];
            const refreshObject = await RefreshTokenModel.findOneAndRemove({
                userId,
                token: postData.refreshToken,
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public logUserAccess = async (req: Request, user: User) => {
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

    private generateToken(user: User, isRefresh: boolean = false): ITokenData {
        const tokenType = "Bearer";
        const refreshToken = RefreshTokenModel.generate(user).token;
        const expiresIn = JWT_EXPIRATION_IN_MINUTES * 60;
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
