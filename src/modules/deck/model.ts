import { Typegoose, prop, Ref } from 'typegoose';
import { User } from '../user';
import { Schema } from 'mongoose';

export class Deck extends Typegoose {
    @prop()
    _id: Schema.Types.ObjectId;
    
    @prop({ required: true })
    userId: User['_id'];

    @prop({ required: true, minlength: 4, maxlength: 24 })
    title: string;

    @prop({ required: true, minlength: 4, maxlength: 256 })
    description: string;

    @prop({ default: null })
    imageUrl?: string;

    @prop({ default: false })
    isPublic?: boolean;
}

export const DeckModel = new Deck().getModelForClass(Deck, { schemaOptions: { timestamps: true } });