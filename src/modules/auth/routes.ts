import { Router } from "express";
import { AuthController } from "./controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

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
        this.router.post("/token", this.controller.renewToken);
        this.router.post("/change-password", isAuthenticated, this.controller.changePassword);
    }
}
