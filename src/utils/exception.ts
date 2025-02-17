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
    constructor(error?: string, pretty?: string) {
        error = Config.NODE_ENV === "dev" ? error : "Something went wrong";
        const message = error || pretty;
        super(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}

export class BadRequestException extends HttpException {
    constructor(message?: string) {
        message = message || "Bad Request";
        super(HttpStatus.BAD_REQUEST, message);
    }
}
