
import { z } from 'zod';

// --- Requests ---
export const GetUserProfileRequestSchema = z.object({
  userId: z.string().uuid(),
});
export type GetUserProfileRequest = z.infer<typeof GetUserProfileRequestSchema>;

export const UpdateUserProfileRequestSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  dateOfBirth: z.string().datetime().optional(), // ISO date string
});
export type UpdateUserProfileRequest = z.infer<typeof UpdateUserProfileRequestSchema>;

// --- Responses ---
export const UserProfileResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: z.string().datetime().nullable().optional(), // ISO date string
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

// --- Errors ---
export enum UserError {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}
