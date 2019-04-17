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

export class InternalServerError extends HttpException {
    constructor() {
        super(500, "Something went wrong");
    }
}
