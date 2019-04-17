import { Response } from "express";

export default function apiResponse(res: Response, data: object, status?: number): void {
    status = status || 200;
    data = data || {};

    res.status(status).json({ status, error: null, data });
}
