
import { z } from 'zod';

// --- Requests ---
export const GetAuditLogRequestSchema = z.object({
  actorId: z.string().uuid().optional(),
  targetId: z.string().uuid().optional(),
  action: z.string().optional(),
  correlationId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});
export type GetAuditLogRequest = z.infer<typeof GetAuditLogRequestSchema>;

// Internal contract for creating audit entries (not exposed via public API directly)
export const InternalCreateAuditLogSchema = z.object({
  timestamp: z.string().datetime().default(new Date().toISOString()),
  actorId: z.string().uuid().nullable().optional(), // Who performed the action
  actorType: z.enum(['USER', 'SYSTEM', 'SERVICE']),
  action: z.string().min(1), // What action was performed (e.g., 'USER_LOGIN', 'ASSET_UPDATED', 'DEATH_VERIFIED')
  targetId: z.string().uuid().nullable().optional(), // On what entity the action was performed
  targetType: z.string().nullable().optional(), // Type of the target entity (e.g., 'User', 'Asset', 'Rule')
  correlationId: z.string().uuid().nullable().optional(), // Links related actions
  metadata: z.record(z.any()).optional(), // Additional relevant data
  cryptographicHash: z.string().optional(), // Hash of the log entry for immutability check
});
export type InternalCreateAuditLog = z.infer<typeof InternalCreateAuditLogSchema>;


// --- Responses ---
export const AuditLogEntrySchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  actorId: z.string().uuid().nullable(),
  actorType: z.enum(['USER', 'SYSTEM', 'SERVICE']),
  action: z.string(),
  targetId: z.string().uuid().nullable(),
  targetType: z.string().nullable(),
  correlationId: z.string().uuid().nullable(),
  metadata: z.record(z.any()).nullable(),
  cryptographicHash: z.string(),
});
export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;

export const ListAuditLogsResponseSchema = z.array(AuditLogEntrySchema);
export type ListAuditLogsResponse = z.infer<typeof ListAuditLogsResponseSchema>;

// --- Errors ---
export enum AuditError {
  AUDIT_LOG_NOT_FOUND = 'AUDIT_LOG_NOT_FOUND',
  INVALID_QUERY_PARAMETERS = 'INVALID_QUERY_PARAMETERS',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}
