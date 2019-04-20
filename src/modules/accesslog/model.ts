import { prop, Typegoose, Ref } from "typegoose";
import { User } from "../user";

export class AccessLog extends Typegoose {
    // tslint:disable-next-line:variable-name
    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;

    @prop({ required: true, ref: User })
    public userId: Ref<User>;

    @prop({ default: null })
    public ipAddress: string;

    @prop({ default: null })
    public browser: string;
}

export const AccessLogModel = new AccessLog().getModelForClass(AccessLog, { schemaOptions: { timestamps: true } });
