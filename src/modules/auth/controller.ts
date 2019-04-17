import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserModel, User } from "../user";
import { Config } from "../../utils/config";
import { TokenData, DataStoredInToken } from "../../interfaces/token";

export class AuthController {
    public async login(req: Request, res: Response) {
        const { username, password } = req.body;

        // check if credentials are set
        if (!(username && password)) {
            return res.status(400).send();
        }

        let currentUser: User;

        UserModel.findOne({ where: { username } })
            .then((user) => {
                currentUser = user;
                console.log(user);
            })
            .catch((error) => {
                console.error("no user found: ", error);
            });

        // check if password is valid
        if (!currentUser.comparePassword(password)) {
            return res.status(401).send();
        }

        // send token
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

    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = Config.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
