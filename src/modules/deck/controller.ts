import { Request, Response, NextFunction } from "express";
import { InternalServerException, API } from "../../utils";
import { DeckModel } from "./model";
import { ICreateDeck } from "./interfaces";
import { IAuthenticatedRequest } from "../../interfaces/auth";

export class DeckController {
    public listAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const decks = await DeckModel.find();

            return API.response(res, {
                decks: decks || [],
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public getDeck = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const deck = await DeckModel.findById(id);

            return API.response(res, {
                deck: deck || {},
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }

    public create = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const postData: ICreateDeck = req.body;

            const deckObject = new DeckModel({
                userId: req.user._id,
                title: postData.title,
                description: postData.description,
                imageUrl: postData.imageUrl,
                isPublic: postData.isPublic,
            });

            const deck = await deckObject.save();

            return API.response(res, {
                deck,
            });
        } catch (err) {
            return next(new InternalServerException(err));
        }
    }
}
