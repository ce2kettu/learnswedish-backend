import * as Validator from "./validation";
import { Router } from "express";
import { DeckController } from "./controller";
import { validateMiddleware, isAuthenticated } from "../../middlewares";

const validate = (validation: any) => [validation, validateMiddleware];

export class DeckRoutes {
    public router: Router;
    private controller: DeckController;

    constructor() {
        this.router = Router();
        this.controller = new DeckController();
        this.routes();
    }

    public routes() {
        this.router.get("/", this.controller.listAll);
        this.router.get("/:id", validate(Validator.getDeck), this.controller.getDeck);
        this.router.post("/create", isAuthenticated, validate(Validator.createDeck), this.controller.create);
    }
}
