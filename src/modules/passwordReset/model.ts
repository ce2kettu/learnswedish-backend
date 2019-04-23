import { Typegoose, prop, Ref, InstanceType } from "typegoose";
import { User } from "../user";

export class PasswordReset extends Typegoose {
    @prop({ required: true, ref: User })
    public userId: Ref<User>;

    @prop({ required: true })
    public verification: string;

    @prop({ default: false })
    public isUsed: boolean;

    @prop({ required: true })
    public expiresAt: Date;

    @prop({ default: () => null })
    public ipRequest: string;

    @prop({ default: () => null })
    public browserRequest: string;

    @prop({ default: () => null })
    public ipChanged: string;

    @prop({ default: () => null })
    public browserChanged: string;
}

export type IPasswordReset = InstanceType<PasswordReset>;
export const PasswordResetModel = new PasswordReset()
.getModelForClass(PasswordReset, { schemaOptions: { timestamps: true } });
