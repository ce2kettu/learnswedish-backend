import * as crypto from "crypto";
import { prop, Typegoose, Ref, staticMethod, ModelType } from "typegoose";
import { addDays } from "date-fns";
import { User } from "../user";

const TOKEN_EXPIRATION_DAYS = 60;

export class RefreshToken extends Typegoose {
    // tslint:disable-next-line: variable-name
    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;

    @prop({ required: true, ref: User })
    public userId: Ref<User>;

    @prop({ required: true })
    public token: string;

    @prop({ required: true })
    public expiresAt: Date;

    // tslint:disable-next-line: member-ordering
    @staticMethod
    public static generate(user: User): RefreshToken {
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

export const RefreshTokenModel = new RefreshToken()
    .getModelForClass(RefreshToken, { schemaOptions: { timestamps: true } });
