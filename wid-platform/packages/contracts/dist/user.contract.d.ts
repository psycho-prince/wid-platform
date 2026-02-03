import { z } from 'zod';
export declare const GetUserProfileRequestSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export type GetUserProfileRequest = z.infer<typeof GetUserProfileRequestSchema>;
export declare const UpdateUserProfileRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    dateOfBirth?: string | undefined;
}, {
    userId: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    dateOfBirth?: string | undefined;
}>;
export type UpdateUserProfileRequest = z.infer<typeof UpdateUserProfileRequestSchema>;
export declare const UserProfileResponseSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    dateOfBirth?: string | null | undefined;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    dateOfBirth?: string | null | undefined;
}>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export declare enum UserError {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    INVALID_DATA = "INVALID_DATA",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"
}
