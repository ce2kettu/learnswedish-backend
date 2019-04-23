import { Typegoose, prop, Ref, InstanceType } from "typegoose";
import { User } from "../user";

export class AccessLog extends Typegoose {
    @prop({ required: true, ref: User })
    public userId: Ref<User>;

    @prop({ default: () => null })
    public ipAddress: string;

    @prop({ default: () => null })
    public browser: string;
}

export type IAccessLog = InstanceType<AccessLog>;
export const AccessLogModel = new AccessLog().getModelForClass(AccessLog, { schemaOptions: { timestamps: true } });
