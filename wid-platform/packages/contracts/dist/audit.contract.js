"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditError = exports.ListAuditLogsResponseSchema = exports.AuditLogEntrySchema = exports.InternalCreateAuditLogSchema = exports.GetAuditLogRequestSchema = void 0;
const zod_1 = require("zod");
// --- Requests ---
exports.GetAuditLogRequestSchema = zod_1.z.object({
    actorId: zod_1.z.string().uuid().optional(),
    targetId: zod_1.z.string().uuid().optional(),
    action: zod_1.z.string().optional(),
    correlationId: zod_1.z.string().uuid().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    limit: zod_1.z.number().int().min(1).max(100).default(50),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Internal contract for creating audit entries (not exposed via public API directly)
exports.InternalCreateAuditLogSchema = zod_1.z.object({
    timestamp: zod_1.z.string().datetime().default(new Date().toISOString()),
    actorId: zod_1.z.string().uuid().nullable().optional(), // Who performed the action
    actorType: zod_1.z.enum(['USER', 'SYSTEM', 'SERVICE']),
    action: zod_1.z.string().min(1), // What action was performed (e.g., 'USER_LOGIN', 'ASSET_UPDATED', 'DEATH_VERIFIED')
    targetId: zod_1.z.string().uuid().nullable().optional(), // On what entity the action was performed
    targetType: zod_1.z.string().nullable().optional(), // Type of the target entity (e.g., 'User', 'Asset', 'Rule')
    correlationId: zod_1.z.string().uuid().nullable().optional(), // Links related actions
    metadata: zod_1.z.record(zod_1.z.any()).optional(), // Additional relevant data
    cryptographicHash: zod_1.z.string().optional(), // Hash of the log entry for immutability check
});
// --- Responses ---
exports.AuditLogEntrySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    timestamp: zod_1.z.string().datetime(),
    actorId: zod_1.z.string().uuid().nullable(),
    actorType: zod_1.z.enum(['USER', 'SYSTEM', 'SERVICE']),
    action: zod_1.z.string(),
    targetId: zod_1.z.string().uuid().nullable(),
    targetType: zod_1.z.string().nullable(),
    correlationId: zod_1.z.string().uuid().nullable(),
    metadata: zod_1.z.record(zod_1.z.any()).nullable(),
    cryptographicHash: zod_1.z.string(),
});
exports.ListAuditLogsResponseSchema = zod_1.z.array(exports.AuditLogEntrySchema);
// --- Errors ---
var AuditError;
(function (AuditError) {
    AuditError["AUDIT_LOG_NOT_FOUND"] = "AUDIT_LOG_NOT_FOUND";
    AuditError["INVALID_QUERY_PARAMETERS"] = "INVALID_QUERY_PARAMETERS";
    AuditError["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
})(AuditError || (exports.AuditError = AuditError = {}));
