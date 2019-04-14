import { Schema, Document, model } from 'mongoose';
import * as mongoose from 'mongoose';
import { IDeckModel } from '../deck';

export interface IFlashCardModel extends Document {
    deckId: IDeckModel['_id'];
    front: string;
    back: string;
    updatedAt: Date;
    createdAt: Date;
}

const schema = new Schema({
    deckId: { type: Schema.Types.ObjectId, required: true },
    front: { type: String, required: true },
    back: { type: String, required: true }
});

// enable createdAt and updatedAt timestamps
schema.set('timestamps', true);

export const User = mongoose.model<IFlashCardModel>('User', schema);