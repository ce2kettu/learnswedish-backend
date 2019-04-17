import { Schema } from "mongoose";
import { prop, Ref, Typegoose } from "typegoose";
import { User } from "../user";

export class Deck extends Typegoose {
    // tslint:disable-next-line:variable-name
    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;

    @prop({ required: true, ref: User })
    public userId: Ref<User>;

    @prop({ required: true, minlength: 4, maxlength: 24 })
    public title: string;

    @prop({ required: true, minlength: 4, maxlength: 256 })
    public description: string;

    @prop({ default: null })
    public imageUrl?: string;

    @prop({ default: false })
    public isPublic?: boolean;
}

export const DeckModel = new Deck().getModelForClass(Deck, { schemaOptions: { timestamps: true } });
