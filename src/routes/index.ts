import { Router } from "express";
import { AuthRoutes } from "../modules/auth";

const routes = Router();

routes.use("/auth", new AuthRoutes().router);

export default routes;
