
import { z } from 'zod';

// --- Requests ---
export const CreateAssetRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1), // e.g., 'crypto', 'document', 'social_media_account'
  encryptedDetails: z.string(), // Placeholder for encrypted asset details
  ownerId: z.string().uuid(),
});
export type CreateAssetRequest = z.infer<typeof CreateAssetRequestSchema>;

export const UpdateAssetRequestSchema = z.object({
  assetId: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.string().min(1).optional(),
  encryptedDetails: z.string().optional(),
});
export type UpdateAssetRequest = z.infer<typeof UpdateAssetRequestSchema>;

export const GetAssetRequestSchema = z.object({
  assetId: z.string().uuid(),
  ownerId: z.string().uuid().optional(), // OwnerId for authorization
});
export type GetAssetRequest = z.infer<typeof GetAssetRequestSchema>;

// --- Responses ---
export const AssetResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  encryptedDetails: z.string(), // Still encrypted
  ownerId: z.string().uuid(),
  isReleasable: z.boolean(), // Indicates if ready for inheritance
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type AssetResponse = z.infer<typeof AssetResponseSchema>;

export const ListAssetsResponseSchema = z.array(AssetResponseSchema);
export type ListAssetsResponse = z.infer<typeof ListAssetsResponseSchema>;

// --- Errors ---
export enum AssetError {
  ASSET_NOT_FOUND = 'ASSET_NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}
