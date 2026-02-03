"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetError = exports.ListAssetsResponseSchema = exports.AssetResponseSchema = exports.GetAssetRequestSchema = exports.UpdateAssetRequestSchema = exports.CreateAssetRequestSchema = void 0;
const zod_1 = require("zod");
// --- Requests ---
exports.CreateAssetRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    type: zod_1.z.string().min(1), // e.g., 'crypto', 'document', 'social_media_account'
    encryptedDetails: zod_1.z.string(), // Placeholder for encrypted asset details
    ownerId: zod_1.z.string().uuid(),
});
exports.UpdateAssetRequestSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.string().min(1).optional(),
    encryptedDetails: zod_1.z.string().optional(),
});
exports.GetAssetRequestSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid(),
    ownerId: zod_1.z.string().uuid().optional(), // OwnerId for authorization
});
// --- Responses ---
exports.AssetResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    type: zod_1.z.string(),
    encryptedDetails: zod_1.z.string(), // Still encrypted
    ownerId: zod_1.z.string().uuid(),
    isReleasable: zod_1.z.boolean(), // Indicates if ready for inheritance
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.ListAssetsResponseSchema = zod_1.z.array(exports.AssetResponseSchema);
// --- Errors ---
var AssetError;
(function (AssetError) {
    AssetError["ASSET_NOT_FOUND"] = "ASSET_NOT_FOUND";
    AssetError["INVALID_DATA"] = "INVALID_DATA";
    AssetError["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
})(AssetError || (exports.AssetError = AssetError = {}));
