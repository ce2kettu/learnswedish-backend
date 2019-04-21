import * as Validator from "../../validation/auth";
import { Router } from "express";
import { AuthController } from "./controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateMiddleware } from "../../middlewares/validate";

const validate = (validation: any) => [validation, validateMiddleware];

export class AuthRoutes {
    public router: Router;
    private controller: AuthController;

    constructor() {
        this.router = Router();
        this.controller = new AuthController();
        this.routes();
    }

    public routes() {
        this.router.post("/signin", validate(Validator.login), this.controller.login);
        this.router.post("/register", validate(Validator.register), this.controller.register);
        this.router.post("/token", validate(Validator.renewToken), this.controller.renewToken);
        this.router.post("/forgot-password", validate(Validator.forgotPassword), this.controller.forgotPassword);
        this.router.post("/change-password", isAuthenticated,
            validate(Validator.changePassword), this.controller.changePassword);
    }
}
