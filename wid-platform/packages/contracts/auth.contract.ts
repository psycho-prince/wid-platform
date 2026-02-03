
import { z } from 'zod';

// --- Requests ---
export const RegisterUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>;

export const LoginUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginUserRequest = z.infer<typeof LoginUserRequestSchema>;

// --- Responses ---
export const AuthResponseSchema = z.object({
  accessToken: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// --- Errors ---
export enum AuthError {
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
}
