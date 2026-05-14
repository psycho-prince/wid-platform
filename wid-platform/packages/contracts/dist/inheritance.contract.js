import { z } from 'zod';
// --- Requests ---
export const CreateInheritanceRuleRequestSchema = z.object({
    ownerId: z.string().uuid(),
    heirId: z.string().uuid(),
    assetId: z.string().uuid().optional(), // If rule applies to a specific asset
    condition: z.string().min(1), // e.g., 'upon death verification', 'after 30 days of death'
    delayDays: z.number().int().min(0).optional(),
});
export const UpdateInheritanceRuleRequestSchema = z.object({
    ruleId: z.string().uuid(),
    heirId: z.string().uuid().optional(),
    assetId: z.string().uuid().optional(),
    condition: z.string().min(1).optional(),
    delayDays: z.number().int().min(0).optional(),
});
export const GetInheritanceRuleRequestSchema = z.object({
    ruleId: z.string().uuid(),
    ownerId: z.string().uuid().optional(),
});
// --- Responses ---
export const InheritanceRuleResponseSchema = z.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    heirId: z.string().uuid(),
    assetId: z.string().uuid().nullable().optional(),
    condition: z.string(),
    delayDays: z.number().int().min(0).nullable().optional(),
    status: z.enum(['active', 'pending_execution', 'executed', 'cancelled']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export const ListInheritanceRulesResponseSchema = z.array(InheritanceRuleResponseSchema);
// --- Errors ---
export var InheritanceError;
(function (InheritanceError) {
    InheritanceError["RULE_NOT_FOUND"] = "RULE_NOT_FOUND";
    InheritanceError["INVALID_DATA"] = "INVALID_DATA";
    InheritanceError["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
})(InheritanceError || (InheritanceError = {}));
