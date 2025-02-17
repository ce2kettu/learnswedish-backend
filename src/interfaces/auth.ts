import { Request } from "express";
import { InstanceType } from "typegoose";
import { User } from "../modules/user";

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRenewToken {
    refreshToken: string;
}

export interface IRegisterUser {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IAuthenticatedRequest extends Request {
    user: InstanceType<User>;
}
