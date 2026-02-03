"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InheritanceError = exports.ListInheritanceRulesResponseSchema = exports.InheritanceRuleResponseSchema = exports.GetInheritanceRuleRequestSchema = exports.UpdateInheritanceRuleRequestSchema = exports.CreateInheritanceRuleRequestSchema = void 0;
const zod_1 = require("zod");
// --- Requests ---
exports.CreateInheritanceRuleRequestSchema = zod_1.z.object({
    ownerId: zod_1.z.string().uuid(),
    heirId: zod_1.z.string().uuid(),
    assetId: zod_1.z.string().uuid().optional(), // If rule applies to a specific asset
    condition: zod_1.z.string().min(1), // e.g., 'upon death verification', 'after 30 days of death'
    delayDays: zod_1.z.number().int().min(0).optional(),
});
exports.UpdateInheritanceRuleRequestSchema = zod_1.z.object({
    ruleId: zod_1.z.string().uuid(),
    heirId: zod_1.z.string().uuid().optional(),
    assetId: zod_1.z.string().uuid().optional(),
    condition: zod_1.z.string().min(1).optional(),
    delayDays: zod_1.z.number().int().min(0).optional(),
});
exports.GetInheritanceRuleRequestSchema = zod_1.z.object({
    ruleId: zod_1.z.string().uuid(),
    ownerId: zod_1.z.string().uuid().optional(),
});
// --- Responses ---
exports.InheritanceRuleResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    ownerId: zod_1.z.string().uuid(),
    heirId: zod_1.z.string().uuid(),
    assetId: zod_1.z.string().uuid().nullable().optional(),
    condition: zod_1.z.string(),
    delayDays: zod_1.z.number().int().min(0).nullable().optional(),
    status: zod_1.z.enum(['active', 'pending_execution', 'executed', 'cancelled']),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.ListInheritanceRulesResponseSchema = zod_1.z.array(exports.InheritanceRuleResponseSchema);
// --- Errors ---
var InheritanceError;
(function (InheritanceError) {
    InheritanceError["RULE_NOT_FOUND"] = "RULE_NOT_FOUND";
    InheritanceError["INVALID_DATA"] = "INVALID_DATA";
    InheritanceError["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
})(InheritanceError || (exports.InheritanceError = InheritanceError = {}));
