import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel, User } from "../user";
import Config from "../../utils/config";
import { ITokenData, IDataStoredInToken } from "../../interfaces/token";
import { HttpException, InternalServerError } from "../../utils/exception";
import apiResponse from "../../utils/apiResponse";

export class AuthController {
    public login = async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body;

        // check if credentials are set
        if (!(username && password)) {
            return new HttpException(400, "Invalid request");
        }

        let user: User;

        // find the user with specified username
        await UserModel.findOne({ username })
        .then((data) => {
            user = data;
        })
        .catch(() => {
            return next(new InternalServerError());
        });

        // no user found
        if (!user) {
            return next(new HttpException(401, `No user found with username: ${username}`));
        }

        // check if password is valid
        await user.comparePassword(password)
            .then((isValid) => {
                if (isValid) {
                    const tokenData = this.generateToken(user);
                    res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                    apiResponse(res, user);
                } else {
                    next(new HttpException(400, "Wrong credentials"));
                }
            })
            .catch(() => {
                next(new InternalServerError());
            });
    }

    public async logout(req: Request, res: Response) { }

    public async register(req: Request, res: Response) { }

    public async changePassword(req: Request, res: Response) {
        const { oldPassword, newPassword } = req.body;

        // get ID from the JWT
        const id = res.locals.jwtPayload.userId;

        // validate parameters
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }
    }

    private generateToken(user: User): ITokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = Config.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id,
        };

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

    private createCookie(tokenData: ITokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}
