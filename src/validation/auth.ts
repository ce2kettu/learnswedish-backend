import { check } from "express-validator/check";
import { UserModel } from "../modules/user";

export const login = [
    check("username")
        .isLength({ min: 4, max: 32 })
        .withMessage("Username must be between 4 and 32 characters"),
    check("password")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
];

export const register = [
    check("username")
        .isLength({ min: 4, max: 32 })
        .withMessage("Username must be between 4 and 32 characters")
        .custom(async (username) => await UserModel.findOne({ username }).then((u) => !u))
        .withMessage("Username is already in use"),
    check("email")
        .isEmail()
        .withMessage("Invalid email")
        .custom(async (email) => await UserModel.findOne({ email }).then((u) => !u))
        .withMessage("Email is already in use"),
    check("password")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
    check("confirmPassword")
        .custom((confirmPassword, { req }) => req.body.password === confirmPassword)
        .withMessage("Passwords do not match"),
    check("firstName")
        .not().isEmpty()
        .withMessage("First Name is empty"),
    check("lastName")
        .not().isEmpty()
        .withMessage("Last Name is empty"),
];

export const changePassword = [
    check("oldPassword")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
    check("newPassword")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
    check("confirmPassword")
        .custom((confirmPassword, { req }) => req.body.newPassword === confirmPassword)
        .withMessage("Passwords do not match"),
];

export const forgotPassword = [
    check("email")
        .isEmail()
        .withMessage("Invalid email"),
];

export const renewToken = [
    check("refreshToken")
        .not().isEmpty()
        .withMessage("No refreshToken provided"),
];
