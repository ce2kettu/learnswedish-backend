import * as validator from "validator";
import { param, body } from "express-validator/check";

export const getDeck = [
    param("id")
        .not().isEmpty()
        .withMessage("Invalid id")
        .custom((id) => validator.isMongoId(id))
        .withMessage("Invalid id"),
];

export const createDeck = [
    body("title")
        .not().isEmpty()
        .withMessage("No title provided"),
    body("description")
        .not().isEmpty()
        .withMessage("No description provided"),
];
