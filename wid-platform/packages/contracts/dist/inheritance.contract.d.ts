import { z } from 'zod';
export declare const CreateInheritanceRuleRequestSchema: z.ZodObject<{
    ownerId: z.ZodString;
    heirId: z.ZodString;
    assetId: z.ZodOptional<z.ZodString>;
    condition: z.ZodString;
    delayDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    ownerId: string;
    heirId: string;
    condition: string;
    assetId?: string | undefined;
    delayDays?: number | undefined;
}, {
    ownerId: string;
    heirId: string;
    condition: string;
    assetId?: string | undefined;
    delayDays?: number | undefined;
}>;
export type CreateInheritanceRuleRequest = z.infer<typeof CreateInheritanceRuleRequestSchema>;
export declare const UpdateInheritanceRuleRequestSchema: z.ZodObject<{
    ruleId: z.ZodString;
    heirId: z.ZodOptional<z.ZodString>;
    assetId: z.ZodOptional<z.ZodString>;
    condition: z.ZodOptional<z.ZodString>;
    delayDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    ruleId: string;
    assetId?: string | undefined;
    heirId?: string | undefined;
    condition?: string | undefined;
    delayDays?: number | undefined;
}, {
    ruleId: string;
    assetId?: string | undefined;
    heirId?: string | undefined;
    condition?: string | undefined;
    delayDays?: number | undefined;
}>;
export type UpdateInheritanceRuleRequest = z.infer<typeof UpdateInheritanceRuleRequestSchema>;
export declare const GetInheritanceRuleRequestSchema: z.ZodObject<{
    ruleId: z.ZodString;
    ownerId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ruleId: string;
    ownerId?: string | undefined;
}, {
    ruleId: string;
    ownerId?: string | undefined;
}>;
export type GetInheritanceRuleRequest = z.infer<typeof GetInheritanceRuleRequestSchema>;
export declare const InheritanceRuleResponseSchema: z.ZodObject<{
    id: z.ZodString;
    ownerId: z.ZodString;
    heirId: z.ZodString;
    assetId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    condition: z.ZodString;
    delayDays: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodEnum<["active", "pending_execution", "executed", "cancelled"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    ownerId: string;
    status: "active" | "pending_execution" | "executed" | "cancelled";
    id: string;
    createdAt: string;
    updatedAt: string;
    heirId: string;
    condition: string;
    assetId?: string | null | undefined;
    delayDays?: number | null | undefined;
}, {
    ownerId: string;
    status: "active" | "pending_execution" | "executed" | "cancelled";
    id: string;
    createdAt: string;
    updatedAt: string;
    heirId: string;
    condition: string;
    assetId?: string | null | undefined;
    delayDays?: number | null | undefined;
}>;
export type InheritanceRuleResponse = z.infer<typeof InheritanceRuleResponseSchema>;
export declare const ListInheritanceRulesResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    ownerId: z.ZodString;
    heirId: z.ZodString;
    assetId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    condition: z.ZodString;
    delayDays: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodEnum<["active", "pending_execution", "executed", "cancelled"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    ownerId: string;
    status: "active" | "pending_execution" | "executed" | "cancelled";
    id: string;
    createdAt: string;
    updatedAt: string;
    heirId: string;
    condition: string;
    assetId?: string | null | undefined;
    delayDays?: number | null | undefined;
}, {
    ownerId: string;
    status: "active" | "pending_execution" | "executed" | "cancelled";
    id: string;
    createdAt: string;
    updatedAt: string;
    heirId: string;
    condition: string;
    assetId?: string | null | undefined;
    delayDays?: number | null | undefined;
}>, "many">;
export type ListInheritanceRulesResponse = z.infer<typeof ListInheritanceRulesResponseSchema>;
export declare enum InheritanceError {
    RULE_NOT_FOUND = "RULE_NOT_FOUND",
    INVALID_DATA = "INVALID_DATA",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"
}
