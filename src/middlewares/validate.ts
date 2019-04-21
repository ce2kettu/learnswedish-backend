import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator/check";
import { API, HttpException } from "../utils";

export async function validateMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${param}: ${msg}`;
        };

        const errors = validationResult(req).formatWith(errorFormatter);

        // check if any errors occurred in validation
        if (!errors.isEmpty()) {
            return API.error(res, 400, errors.array());
        }
    } catch (err) {
        return next(new HttpException(400, "wat"));
    }
}
