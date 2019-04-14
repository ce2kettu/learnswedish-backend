import { Schema, Document, model } from 'mongoose';
import * as mongoose from 'mongoose';
import { IUserModel } from '../user';
import { IFlashCardModel } from '../flashcard';

export interface IReviewModel extends Document {
    userId: IUserModel['_id'];
    cardId: IFlashCardModel['_id'];
    progress: number;
    dueDate: Date;
    dueAgain: boolean;
    updatedAt: Date;
    createdAt: Date;
}

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    cardId: { type: Schema.Types.ObjectId, required: true },
    progress: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    dueAgain: { type: Boolean, required: true }
});

// enable createdAt and updatedAt timestamps
schema.set('timestamps', true);

export const User = mongoose.model<IReviewModel>('User', schema);