import * as jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { Config, HttpException, InternalServerException, UnauthorizedException } from "../utils";
import { ITokenPayload } from "../interfaces/token";
import { User, UserModel } from "../modules/user";
import { IAuthenticatedRequest } from "../interfaces/auth";

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
    try {
        const token = getToken(req);

        // no token provided
        if (!token) {
            return next(new UnauthorizedException("Invalid token"));
        }

        const verification = jwt.verify(token, Config.JWT_SECRET) as ITokenPayload;
        const userId = verification._id;
        const user = await UserModel.findById(userId);

        if (user) {
            req.user = user;
            next();
        } else {
            return next(new HttpException(400, "Wrong authentication token"));
        }
    } catch (err) {
        return next(new HttpException(400, "Wrong authentication token"));
    }
}
