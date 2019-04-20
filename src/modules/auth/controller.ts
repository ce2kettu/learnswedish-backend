import * as jwt from "jsonwebtoken";
import * as requestIp from "request-ip";
import { Request, Response, NextFunction } from "express";
import { UserModel, User } from "../user";
import { Config, InvalidRequestException, UnauthorizedException, InternalServerException } from "../../utils";
import { ITokenData, IDataStoredInToken } from "../../interfaces/token";
import { API } from "../../utils";
import { AccessLogModel } from "../accesslog";

const tokenExpire = 60 * 60; // an hour
const refreshTokenExpire = 31 * 24 * 60 * 60; // 31 days

interface ILoginCredentials {
    username: string;
    password: string;
}

interface IRenewToken {
    refreshToken: string;
}

interface IRegisterUser {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

interface IAuthenticatedRequest extends Request {
    user: User;
}

export class AuthController {
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postData: ILoginCredentials = req.body;

            // TODO: better validation
            // validate request
            if (!(postData.username && postData.password)) {
                return next(new InvalidRequestException());
            }

            // find the user with specified username
            const user: User = await UserModel.findOne({ username: postData.username });

            // no user found
            if (!user) {
                return next(new UnauthorizedException("Wrong username or password"));
            }

            // check if the specified password is valid
            const isValid = await user.comparePassword(postData.password);

            if (!isValid) {
                next(new UnauthorizedException("Wrong username or password"));
            }

            const token = this.generateToken(user);
            const refreshToken = this.generateToken(user, true);

            // log new access
            await this.logUserAccess(req, user);

            // remove passsword property from response
            user.password = undefined;

            return API.response(res, {
                token,
                refreshToken,
                user,
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

    public renewToken = async (req: Request, res: Response, next: NextFunction) => {
        const postData: IRenewToken = req.body;

        // validate request
        if (!postData.refreshToken) {
            return new InvalidRequestException();
        }
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        const postData: IRegisterUser = req.body;
    }

    public changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const { oldPassword, newPassword } = req.body;

        // get ID from the JWT
        const id = res.locals.jwtPayload.userId;

        // validate parameters
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }
    }

    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const postData = req.body;
    }

    private generateToken(user: User, isRefresh: boolean = false): ITokenData {
        const expiresIn = isRefresh ? refreshTokenExpire : tokenExpire;
        const secret = Config.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id,
        };

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
