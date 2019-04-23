import { Typegoose, prop, Ref, InstanceType } from "typegoose";
import { Deck } from "../deck";

export class FlashCard extends Typegoose {
    @prop({ required: true, ref: Deck })
    public deckId: Ref<Deck>;

    @prop({ required: true })
    public front: string;

    @prop({ required: true })
    public back: string;
}

export type IFlashCard = InstanceType<FlashCard>;
export const FlashCardModel = new FlashCard().getModelForClass(FlashCard, { schemaOptions: { timestamps: true } });
