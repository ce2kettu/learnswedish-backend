import { prop, Ref, Typegoose } from "typegoose";
import { Deck } from "../deck";

export class FlashCard extends Typegoose {
    // tslint:disable-next-line: variable-name
    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;

    @prop({ required: true, ref: Deck })
    public deckId: Ref<Deck>;

    @prop({ required: true })
    public front: string;

    @prop({ required: true })
    public back: string;
}

export const FlashCardModel = new FlashCard().getModelForClass(FlashCard, { schemaOptions: { timestamps: true } });
