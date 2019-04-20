import * as HttpStatus from "http-status-codes";
import { Config } from "./config";

// tslint:disable: max-classes-per-file

export class HttpException extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class InternalServerException extends HttpException {
    constructor(message: string) {
        message = Config.NODE_ENV === "dev" ? message : "Something went wrong";
        super(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}

export class InvalidRequestException extends HttpException {
    constructor(message?: string) {
        message = message || "Invalid request";
        super(HttpStatus.BAD_REQUEST, message);
    }
}
