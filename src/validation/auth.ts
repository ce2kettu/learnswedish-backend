import * as validator from "validator";
import { check } from "express-validator/check";
import { UserModel } from "../modules/user";

export const login = [
    check("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email"),
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
        .normalizeEmail()
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
        .normalizeEmail()
        .withMessage("Invalid email"),
];

export const renewToken = [
    check("refreshToken")
        .not().isEmpty()
        .withMessage("No refreshToken provided")
        .custom((refreshToken, { req }) => {
            const parts = refreshToken.split(".");

            if (parts.length === 2) {
                const userId = parts[0];
                const token = parts[1];

                if (validator.isMongoId(userId) && token.length === 80) {
                    return true;
                }
             }

            return false;
        })
        .withMessage("Invalid refreshToken"),
];
