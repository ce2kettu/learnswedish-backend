import { Typegoose, prop, Ref, InstanceType } from "typegoose";
import { FlashCard } from "../flashCard";
import { User } from "../user";

export class Review extends Typegoose {
    @prop({ required: true, ref: User })
    public userId: Ref<User>;

    @prop({ required: true, ref: FlashCard })
    public cardId: Ref<FlashCard>;

    @prop({ required: true })
    public progress: number;

    @prop({ required: true })
    public dueAgain: boolean;

    @prop({ required: true })
    public dueDate: Date;
}

export type IReview = InstanceType<Review>;
export const ReviewModel = new Review().getModelForClass(Review, { schemaOptions: { timestamps: true } });
