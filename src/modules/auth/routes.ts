import { Router } from "express";
import { AuthController } from "./controller";

export class AuthRoutes {
    public router: Router;
    private controller: AuthController;

    constructor() {
        this.router = Router();
        this.controller = new AuthController();
        this.routes();
    }

    public routes() {
        this.router.get("/login", this.controller.login);
        this.router.get("/logout", this.controller.logout);
        this.router.get("/register", this.controller.register);
        this.router.get("/change-password", this.controller.changePassword);
    }
}
