"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = exports.UserProfileResponseSchema = exports.UpdateUserProfileRequestSchema = exports.GetUserProfileRequestSchema = void 0;
const zod_1 = require("zod");
// --- Requests ---
exports.GetUserProfileRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
exports.UpdateUserProfileRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(), // ISO date string
});
// --- Responses ---
exports.UserProfileResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().nullable().optional(),
    lastName: zod_1.z.string().nullable().optional(),
    dateOfBirth: zod_1.z.string().datetime().nullable().optional(), // ISO date string
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
// --- Errors ---
var UserError;
(function (UserError) {
    UserError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    UserError["INVALID_DATA"] = "INVALID_DATA";
    UserError["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
})(UserError || (exports.UserError = UserError = {}));
