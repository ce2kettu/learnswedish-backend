import * as crypto from "crypto";
import { Typegoose, prop, Ref, staticMethod, InstanceType } from "typegoose";
import { addDays } from "date-fns";
import { User, IUser } from "../user";

const TOKEN_EXPIRATION_DAYS = 60;

export class RefreshToken extends Typegoose {
    @prop({ required: true, ref: User })
    public userId: Ref<User>;

    @prop({ required: true })
    public token: string;

    @prop({ required: true })
    public expiresAt: Date;

    @staticMethod
    public static generate(user: IUser): RefreshToken {
        const hash = crypto.randomBytes(40).toString("hex");
        const token = `${user._id}.${hash}`;
        const expiresAt = addDays(Date.now(), TOKEN_EXPIRATION_DAYS);
        const tokenEntry = new RefreshTokenModel({
            userId: user._id,
            token,
            expiresAt,
        });
        tokenEntry.save();

        return tokenEntry;
    }
}

export type IRefreshToken = InstanceType<RefreshToken>;
export const RefreshTokenModel = new RefreshToken()
    .getModelForClass(RefreshToken, { schemaOptions: { timestamps: true } });
