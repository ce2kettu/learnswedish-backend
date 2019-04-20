import { Request } from "express";
import { InstanceType } from "typegoose";
import { User } from "../modules/user";

export interface ILoginCredentials {
    username: string;
    password: string;
}

export interface IRenewToken {
    refreshToken: string;
}

export interface IRegisterUser {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IAuthenticatedRequest extends Request {
    user: InstanceType<User>;
}
