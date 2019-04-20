import * as HttpStatus from "http-status-codes";
import { Response } from "express";

export class API {
    public static response(res: Response, data?: object, status?: number) {
        data = data || {};
        status = status || HttpStatus.OK;

        res.status(status).json({ status, error: null, data });
    }

    public static error(res: Response, status?: number, error?: string) {
        status = status || HttpStatus.INTERNAL_SERVER_ERROR;
        error = error.toLowerCase() || null;

        res.status(status).json({ status, error });
    }
}
