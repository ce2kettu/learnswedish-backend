import { Router } from "express";
import { AuthRoutes } from "../modules/auth";
import { HttpException } from "../utils/exception";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const routes = Router();

routes.use("/auth", new AuthRoutes().router);

routes.get("/me", isAuthenticated, (req, res, next) => {
    res.status(200).json({ status: 200, error: null, message: "authenticated" });
});

routes.get("/status", (req, res, next) => {
    res.status(200).json({ status: 200, error: null });
});

export default routes;
