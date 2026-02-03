import { z } from 'zod';
export declare const GetAuditLogRequestSchema: z.ZodObject<{
    actorId: z.ZodOptional<z.ZodString>;
    targetId: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodString>;
    correlationId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    actorId?: string | undefined;
    targetId?: string | undefined;
    action?: string | undefined;
    correlationId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    actorId?: string | undefined;
    targetId?: string | undefined;
    action?: string | undefined;
    correlationId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export type GetAuditLogRequest = z.infer<typeof GetAuditLogRequestSchema>;
export declare const InternalCreateAuditLogSchema: z.ZodObject<{
    timestamp: z.ZodDefault<z.ZodString>;
    actorId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    actorType: z.ZodEnum<["USER", "SYSTEM", "SERVICE"]>;
    action: z.ZodString;
    targetId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    targetType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    correlationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    cryptographicHash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: string;
    timestamp: string;
    actorType: "USER" | "SYSTEM" | "SERVICE";
    actorId?: string | null | undefined;
    targetId?: string | null | undefined;
    correlationId?: string | null | undefined;
    targetType?: string | null | undefined;
    metadata?: Record<string, any> | undefined;
    cryptographicHash?: string | undefined;
}, {
    action: string;
    actorType: "USER" | "SYSTEM" | "SERVICE";
    actorId?: string | null | undefined;
    targetId?: string | null | undefined;
    correlationId?: string | null | undefined;
    timestamp?: string | undefined;
    targetType?: string | null | undefined;
    metadata?: Record<string, any> | undefined;
    cryptographicHash?: string | undefined;
}>;
export type InternalCreateAuditLog = z.infer<typeof InternalCreateAuditLogSchema>;
export declare const AuditLogEntrySchema: z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodString;
    actorId: z.ZodNullable<z.ZodString>;
    actorType: z.ZodEnum<["USER", "SYSTEM", "SERVICE"]>;
    action: z.ZodString;
    targetId: z.ZodNullable<z.ZodString>;
    targetType: z.ZodNullable<z.ZodString>;
    correlationId: z.ZodNullable<z.ZodString>;
    metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    cryptographicHash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    actorId: string | null;
    targetId: string | null;
    action: string;
    correlationId: string | null;
    timestamp: string;
    actorType: "USER" | "SYSTEM" | "SERVICE";
    targetType: string | null;
    metadata: Record<string, any> | null;
    cryptographicHash: string;
}, {
    id: string;
    actorId: string | null;
    targetId: string | null;
    action: string;
    correlationId: string | null;
    timestamp: string;
    actorType: "USER" | "SYSTEM" | "SERVICE";
    targetType: string | null;
    metadata: Record<string, any> | null;
    cryptographicHash: string;
}>;
export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;
export declare const ListAuditLogsResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodString;
    actorId: z.ZodNullable<z.ZodString>;
    actorType: z.ZodEnum<["USER", "SYSTEM", "SERVICE"]>;
    action: z.ZodString;
    targetId: z.ZodNullable<z.ZodString>;
    targetType: z.ZodNullable<z.ZodString>;
    correlationId: z.ZodNullable<z.ZodString>;
    metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    cryptographicHash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    actorId: string | null;
    targetId: string | null;
    action: string;
    correlationId: string | null;
    timestamp: string;
    actorType: "USER" | "SYSTEM" | "SERVICE";
    targetType: string | null;
    metadata: Record<string, any> | null;
    cryptographicHash: string;
}, {
    id: string;
    actorId: string | null;
    targetId: string | null;
    action: string;
    correlationId: string | null;
    timestamp: string;
    actorType: "USER" | "SYSTEM" | "SERVICE";
    targetType: string | null;
    metadata: Record<string, any> | null;
    cryptographicHash: string;
}>, "many">;
export type ListAuditLogsResponse = z.infer<typeof ListAuditLogsResponseSchema>;
export declare enum AuditError {
    AUDIT_LOG_NOT_FOUND = "AUDIT_LOG_NOT_FOUND",
    INVALID_QUERY_PARAMETERS = "INVALID_QUERY_PARAMETERS",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"
}
