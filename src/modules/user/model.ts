import { Typegoose, prop, pre, instanceMethod, ModelType } from 'typegoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';

const SALT_WORK_FACTOR = 10;

@pre<User>('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
})

export class User extends Typegoose {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

    @prop({ required: true, unique: true, minlength: 4, maxlength: 32 })
    username: string;

    @prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @prop({ required: true, minlength: 6, maxlength: 72 })
    password: string;

    @prop({ required: true })
    firstName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ default: true })
    isActive: boolean;

    @prop({ default: false })
    isAdmin: boolean;

    @prop({ default: null })
    ipAddress: string;

    @prop({ default: null })
    lastLogin: Date;

    @instanceMethod
    public comparePassword(password: string): Promise<Boolean | Error> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.password)
                .then(match => resolve(match))
                .catch(error => reject(error));
        });
    }

    @instanceMethod
    public toAuthJson(this: InstanceType<ModelType<User>> & typeof User) {
        return {
            id: this._id,
            email: this.email,
            token: this.generateToken(),
        };
    }

    @instanceMethod
    public generateToken(this: InstanceType<ModelType<User>> & typeof User) {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            email: this.email,
            id: this._id,
            exp: parseInt(String(expirationDate.getTime() / 1000), 10),
        }, 'secret');
    }
}

export const UserModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });