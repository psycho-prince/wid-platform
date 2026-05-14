import { z } from 'zod';
// --- Requests ---
export const RegisterUserRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export const LoginUserRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
// --- Responses ---
export const AuthResponseSchema = z.object({
    accessToken: z.string(),
});
// --- Errors ---
export var AuthError;
(function (AuthError) {
    AuthError["EMAIL_ALREADY_EXISTS"] = "EMAIL_ALREADY_EXISTS";
    AuthError["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    AuthError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    AuthError["INVALID_TOKEN"] = "INVALID_TOKEN";
    AuthError["UNAUTHORIZED"] = "UNAUTHORIZED";
})(AuthError || (AuthError = {}));
