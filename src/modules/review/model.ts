import { Typegoose, prop, Ref } from 'typegoose';
import { User } from '../user';
import { Schema } from 'mongoose';
import { FlashCard } from '../flashcard';

export class Review extends Typegoose {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    
    @prop({ required: true, ref: User })
    userId: Ref<User>;
    
    @prop({ required: true, ref: FlashCard })
    cardId: Ref<FlashCard>;

    @prop({ required: true })
    progress: number;

    @prop({ required: true })
    dueAgain: boolean;

    @prop({ required: true })
    dueDate: Date;
}

export const ReviewModel = new Review().getModelForClass(Review, { schemaOptions: { timestamps: true } });