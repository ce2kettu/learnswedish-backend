import { Schema, Document, model } from 'mongoose';
import { IUserModel } from '../user';

export interface IDeckModel extends Document {
    userId: IUserModel['_id'];
    title: string;
    description: string;
    imageUrl: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: null },
    isPublic: { type: Boolean, default: false }
});

// enable createdAt and updatedAt timestamps
schema.set('timestamps', true);

export const Deck = model<IDeckModel>('Deck', schema);