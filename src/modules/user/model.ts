import * as bcrypt from "bcrypt";
import { instanceMethod, pre, prop, Typegoose } from "typegoose";

const SALT_WORK_FACTOR = 10;

@pre<User>("save", function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) { return next(); }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (errSalt, salt) => {
        if (errSalt) { return next(errSalt); }

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (errHash, hash) => {
            if (errHash) { return next(errHash); }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
})

export class User extends Typegoose {
    // tslint:disable-next-line: variable-name
    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;

    @prop({ required: true, unique: true, minlength: 4, maxlength: 32 })
    public username: string;

    @prop({ required: true, unique: true, lowercase: true, trim: true })
    public email: string;

    @prop({ required: true, minlength: 6, maxlength: 72 })
    public password: string;

    @prop({ required: true })
    public firstName: string;

    @prop({ required: true })
    public lastName: string;

    @prop({ default: true })
    public isActive: boolean;

    @prop({ default: false })
    public isAdmin: boolean;

    @instanceMethod
    public comparePassword(password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.password)
                .then((isMatch) => resolve(isMatch))
                .catch((err) => reject(err));
        });
    }
}

export const UserModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });
