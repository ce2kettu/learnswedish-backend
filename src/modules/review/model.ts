import { Typegoose, prop, Ref } from 'typegoose';
import { User } from '../user';
import { Schema } from 'mongoose';
import { FlashCard } from '../flashcard';

export class Review extends Typegoose {
    @prop()
    _id: Schema.Types.ObjectId;
    
    @prop({ required: true })
    userId: User['_id'];

    @prop({ required: true })
    cardId: FlashCard['_id'];

    @prop({ required: true })
    progress: number;

    @prop({ required: true })
    dueAgain: boolean;

    @prop({ required: true })
    dueDate: Date;
}

export const ReviewModel = new Review().getModelForClass(Review, { schemaOptions: { timestamps: true } });