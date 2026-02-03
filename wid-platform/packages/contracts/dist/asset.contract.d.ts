import { z } from 'zod';
export declare const CreateAssetRequestSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodString;
    encryptedDetails: z.ZodString;
    ownerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    encryptedDetails: string;
    ownerId: string;
    description?: string | undefined;
}, {
    name: string;
    type: string;
    encryptedDetails: string;
    ownerId: string;
    description?: string | undefined;
}>;
export type CreateAssetRequest = z.infer<typeof CreateAssetRequestSchema>;
export declare const UpdateAssetRequestSchema: z.ZodObject<{
    assetId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    encryptedDetails: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assetId: string;
    name?: string | undefined;
    description?: string | undefined;
    type?: string | undefined;
    encryptedDetails?: string | undefined;
}, {
    assetId: string;
    name?: string | undefined;
    description?: string | undefined;
    type?: string | undefined;
    encryptedDetails?: string | undefined;
}>;
export type UpdateAssetRequest = z.infer<typeof UpdateAssetRequestSchema>;
export declare const GetAssetRequestSchema: z.ZodObject<{
    assetId: z.ZodString;
    ownerId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assetId: string;
    ownerId?: string | undefined;
}, {
    assetId: string;
    ownerId?: string | undefined;
}>;
export type GetAssetRequest = z.infer<typeof GetAssetRequestSchema>;
export declare const AssetResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    type: z.ZodString;
    encryptedDetails: z.ZodString;
    ownerId: z.ZodString;
    isReleasable: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string | null;
    type: string;
    encryptedDetails: string;
    ownerId: string;
    id: string;
    isReleasable: boolean;
    createdAt: string;
    updatedAt: string;
}, {
    name: string;
    description: string | null;
    type: string;
    encryptedDetails: string;
    ownerId: string;
    id: string;
    isReleasable: boolean;
    createdAt: string;
    updatedAt: string;
}>;
export type AssetResponse = z.infer<typeof AssetResponseSchema>;
export declare const ListAssetsResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    type: z.ZodString;
    encryptedDetails: z.ZodString;
    ownerId: z.ZodString;
    isReleasable: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string | null;
    type: string;
    encryptedDetails: string;
    ownerId: string;
    id: string;
    isReleasable: boolean;
    createdAt: string;
    updatedAt: string;
}, {
    name: string;
    description: string | null;
    type: string;
    encryptedDetails: string;
    ownerId: string;
    id: string;
    isReleasable: boolean;
    createdAt: string;
    updatedAt: string;
}>, "many">;
export type ListAssetsResponse = z.infer<typeof ListAssetsResponseSchema>;
export declare enum AssetError {
    ASSET_NOT_FOUND = "ASSET_NOT_FOUND",
    INVALID_DATA = "INVALID_DATA",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"
}
