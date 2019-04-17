import { Router } from "express";
import { AuthRoutes } from "../modules/auth";
import { HttpException } from "../utils/exception";

const routes = Router();

routes.use("/auth", new AuthRoutes().router);

// return page not found for all other routes
routes.all("*", (req, res, next) => {
    next(new HttpException(404, "Page not found"));
});

export default routes;
