import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/exception";

function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction): void {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({ status, error: message.toLowerCase() });
}

export default errorMiddleware;
