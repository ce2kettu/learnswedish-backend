import { Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export interface IUserModel extends Document {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    isAdmin: boolean;
    ipAddress: string;
    lastLogin: Date;
    updatedAt: Date;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const schema = new Schema({
    username: { type: String, required: true, unique: true, minlength: 4, maxlength: 32},
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, maxlength: 72 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    ipAddress: { type: String, default: null },
    lastLogin: { type: Date, default: null }
});

// enable createdAt and updatedAt timestamps
schema.set('timestamps', true);

schema.pre("save", (next) => {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) { return next(err); }

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

schema.methods.comparePasswords = (candidatePassword: string): Promise<boolean> => {
    const password = this.password;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, isMatch) => {
            if (err) return reject(err);

            return resolve(isMatch);
        });
    });
};

export const User = model<IUserModel>('User', schema);