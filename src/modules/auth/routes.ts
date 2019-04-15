import { Router } from "express";
import { AuthController } from "./controller";

export class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get("/");
    }
}
