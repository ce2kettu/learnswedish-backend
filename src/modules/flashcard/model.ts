import { Typegoose, prop, Ref } from 'typegoose';
import { Deck } from '../deck';
import { Schema } from 'mongoose';

export class FlashCard extends Typegoose {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    
    @prop({ required: true, ref: Deck })
    deckId: Ref<Deck>;

    @prop({ required: true })
    front: string;

    @prop({ required: true })
    back: string;
}

export const FlashCardModel = new FlashCard().getModelForClass(FlashCard, { schemaOptions: { timestamps: true } });