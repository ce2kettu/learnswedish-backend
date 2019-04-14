import { Typegoose, prop, Ref } from 'typegoose';
import { Deck } from '../deck';
import { Schema } from 'mongoose';

export class FlashCard extends Typegoose {
    @prop()
    _id: Schema.Types.ObjectId;
    
    @prop({ required: true })
    deckId: Deck['_id'];

    @prop({ required: true })
    front: string;

    @prop({ required: true })
    back: string;
}

export const FlashCardModel = new FlashCard().getModelForClass(FlashCard, { schemaOptions: { timestamps: true } });