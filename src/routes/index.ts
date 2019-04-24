import { Router } from "express";
import { AuthRoutes } from "../modules/auth";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { DeckRoutes } from "../modules/deck";

const routes = Router();

routes.use("/auth", new AuthRoutes().router);
routes.use("/decks", new DeckRoutes().router);

routes.post("/me", isAuthenticated, (req, res, next) => {
    res.status(200).json({ status: 200, error: null, message: "authenticated" });
});

routes.get("/status", (req, res, next) => {
    res.status(200).json({ status: 200, error: null });
});

export default routes;
