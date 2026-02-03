"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = exports.AuthResponseSchema = exports.LoginUserRequestSchema = exports.RegisterUserRequestSchema = void 0;
const zod_1 = require("zod");
// --- Requests ---
exports.RegisterUserRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.LoginUserRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
// --- Responses ---
exports.AuthResponseSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
});
// --- Errors ---
var AuthError;
(function (AuthError) {
    AuthError["EMAIL_ALREADY_EXISTS"] = "EMAIL_ALREADY_EXISTS";
    AuthError["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    AuthError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    AuthError["INVALID_TOKEN"] = "INVALID_TOKEN";
    AuthError["UNAUTHORIZED"] = "UNAUTHORIZED";
})(AuthError || (exports.AuthError = AuthError = {}));
