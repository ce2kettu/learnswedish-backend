import * as HttpStatus from "http-status-codes";
import { Response } from "express";

export class API {
    public static response(res: Response, data?: object, status?: number) {
        data = data || {};
        status = status || HttpStatus.OK;

        res.status(status).json({ statusCode: status, errors: [], data });
    }

    public static error(res: Response, status?: number, errors?: any[]) {
        status = status || HttpStatus.INTERNAL_SERVER_ERROR;
        errors = errors || null;

        res.status(status).json({ statusCode: status, errors });
    }
}
