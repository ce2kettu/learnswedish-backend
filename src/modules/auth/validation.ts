import * as validator from "validator";
import { body } from "express-validator/check";
import { UserModel } from "../user";

export const login = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
];

export const register = [
    body("username")
        .isLength({ min: 4, max: 32 })
        .trim()
        .withMessage("Username must be between 4 and 32 characters")
        .custom(async (username) => await UserModel.findOne({ username }).then((u) => !u))
        .withMessage("Username is already in use"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email")
        .custom(async (email) => await UserModel.findOne({ email }).then((u) => !u))
        .withMessage("Email is already in use"),
    body("password")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
    body("confirmPassword")
        .custom((confirmPassword, { req }) => req.body.password === confirmPassword)
        .withMessage("Passwords do not match"),
    body("firstName")
        .not().isEmpty()
        .trim()
        .withMessage("First Name is empty"),
    body("lastName")
        .not().isEmpty()
        .trim()
        .withMessage("Last Name is empty"),
];

export const changePassword = [
    body("oldPassword")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
    body("newPassword")
        .isLength({ min: 6, max: 72 })
        .withMessage("Invalid password"),
    body("confirmPassword")
        .custom((confirmPassword, { req }) => req.body.newPassword === confirmPassword)
        .withMessage("Passwords do not match"),
];

export const forgotPassword = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email"),
];

export const resetPassword = [
    body("t")
        .not().isEmpty()
        .withMessage("Invalid password reset id")
        .custom((verification) => verification.length === 80)
        .withMessage("Invalid password reset id"),
];

export const renewToken = [
    body("refreshToken")
        .not().isEmpty()
        .withMessage("Invalid refreshToken")
        .custom((refreshToken) => {
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
