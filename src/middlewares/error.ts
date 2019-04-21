import * as HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { HttpException, Config } from "../utils";
import { API } from "../utils";

export function routeNotFound(req: Request, res: Response, next: NextFunction): void {
    API.error(res, HttpStatus.NOT_FOUND, [{ message: "Not Found" }]);
}

export function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction): void {
    const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = Config.NODE_ENV === "dev" ? err.message : "Something went wrong";

    API.error(res, status, [{ message: message.toString() }]);
}
