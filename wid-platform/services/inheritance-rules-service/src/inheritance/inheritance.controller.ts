
import { Controller, Post, Body, Req, UsePipes, Get, Param } from '@nestjs/common';
import { InheritanceService } from './inheritance.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { z } from 'zod';
import { CreateInheritanceRuleRequestSchema } from '@wid-platform/contracts';
import { InheritanceRule } from './inheritance-rule.entity';

const EvaluateRulesRequestSchema = z.object({
    userId: z.string().uuid(),
});

@Controller('inheritance')
export class InheritanceController {
  constructor(private readonly inheritanceService: InheritanceService) {}

  @Post('evaluate')
  @UsePipes(new ZodValidationPipe(EvaluateRulesRequestSchema))
  async evaluateRules(
    @Body() body: z.infer<typeof EvaluateRulesRequestSchema>,
    @Req() req: any, // Assuming correlationId is attached to req
  ): Promise<any> {
    const correlationId = req.correlationId || '';
    return this.inheritanceService.evaluateRules(body.userId, correlationId);
  }

  @Post('rules')
  @UsePipes(new ZodValidationPipe(CreateInheritanceRuleRequestSchema))
  async createRule(
      @Body() body: z.infer<typeof CreateInheritanceRuleRequestSchema>,
      @Req() req: any,
  ): Promise<InheritanceRule> {
      const { ownerId, heirId, condition, assetId, delayDays } = body;
      return this.inheritanceService.createRule(ownerId, heirId, condition, assetId, delayDays);
  }

  @Get('rules/:ownerId')
  async getRulesByOwner(@Param('ownerId') ownerId: string): Promise<InheritanceRule[]> {
      return this.inheritanceService.findRulesByOwner(ownerId);
  }

  @Get('rule/:ruleId')
  async getRuleById(@Param('ruleId') ruleId: string): Promise<InheritanceRule> {
      return this.inheritanceService.getRuleById(ruleId);
  }
}
