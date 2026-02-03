
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InheritanceRule } from './inheritance-rule.entity';

@Injectable()
export class InheritanceService {
  private readonly logger = new Logger(InheritanceService.name);

  constructor(
    @InjectRepository(InheritanceRule)
    private inheritanceRuleRepository: Repository<InheritanceRule>,
  ) {}

  async evaluateRules(userId: string, correlationId: string): Promise<any> {
    this.logger.log(`Evaluating inheritance rules for user ${userId}. Correlation ID: ${correlationId}`);
    // MVP: For now, just log and return a dummy success.
    // In a real implementation, this would involve complex logic:
    // 1. Fetch all active rules for the user.
    // 2. Check conditions (e.g., delayDays).
    // 3. Trigger actions (e.g., mark assets releasable, send notifications).
    const rules = await this.inheritanceRuleRepository.find({ where: { ownerId: userId, status: 'active' } });
    this.logger.log(`Found ${rules.length} active rules for user ${userId}.`);

    // Simulate rule evaluation and marking for release
    for (const rule of rules) {
        rule.status = 'pending_execution'; // Or 'executed' if conditions met
        await this.inheritanceRuleRepository.save(rule);
        this.logger.log(`Rule ${rule.id} for user ${userId} updated to 'pending_execution'.`);
    }


    return { status: 'success', message: `Rules evaluated for user ${userId}` };
  }

  // Basic CRUD for rules (for eventual UI interaction)
  async createRule(ownerId: string, heirId: string, condition: string, assetId?: string, delayDays?: number): Promise<InheritanceRule> {
      const rule = this.inheritanceRuleRepository.create({
          ownerId, heirId, condition, assetId, delayDays, status: 'active'
      });
      return this.inheritanceRuleRepository.save(rule);
  }

  async findRulesByOwner(ownerId: string): Promise<InheritanceRule[]> {
      return this.inheritanceRuleRepository.find({ where: { ownerId } });
  }

  async getRuleById(ruleId: string): Promise<InheritanceRule> {
      return this.inheritanceRuleRepository.findOne({ where: { id: ruleId } });
  }
}
