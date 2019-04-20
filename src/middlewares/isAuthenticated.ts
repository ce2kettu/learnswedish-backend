import * as jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { Config, HttpException, InternalServerException, UnauthorizedException } from "../utils";
import { IDataStoredInToken } from "../interfaces/token";
import { User, UserModel } from "../modules/user";

interface IAuthenticatedRequest extends Request {
    user: User;
}

function getToken(req: Request): string {
    // try to get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];

    // get token from query parameter
    } else if (req.query && req.query.token) {
        return req.query.token;
    }

    return null;
}

export async function isAuthenticated(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    const token = getToken(req);

    // no token provided
    if (!token) {
        return next(new UnauthorizedException("Invalid token"));
    }

    try {
        const verification = jwt.verify(token, Config.JWT_SECRET) as IDataStoredInToken;
        const userId = verification._id;
        let user: User;

        await UserModel.findById(userId)
            .then((data) => {
                user = data;
            })
            .catch((err) => {
                return next(new InternalServerException(err));
            });

        if (user) {
            req.user = user;
            next();
        } else {
            next(new HttpException(400, "Wrong authentication token"));
        }
    } catch (err) {
        next(new HttpException(400, "Wrong authentication token"));
    }
}
