import { z } from 'zod';
export declare const RegisterUserRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>;
export declare const LoginUserRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginUserRequest = z.infer<typeof LoginUserRequestSchema>;
export declare const AuthResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
}, {
    accessToken: string;
}>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export declare enum AuthError {
    EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    INVALID_TOKEN = "INVALID_TOKEN",
    UNAUTHORIZED = "UNAUTHORIZED"
}
