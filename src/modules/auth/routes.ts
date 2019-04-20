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
        this.router.post("/signin", this.controller.login);
        this.router.post("/register", this.controller.register);
        this.router.post("/change-password", this.controller.changePassword);
    }
}
