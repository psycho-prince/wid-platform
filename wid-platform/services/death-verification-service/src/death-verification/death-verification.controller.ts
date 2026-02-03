
import { Controller, Get, Post, Body, Param, Put, UseGuards, Req } from '@nestjs/common';
import { DeathVerificationService, DeathVerificationStatus } from './death-verification.service';
import { DeathVerification } from './death-verification.entity';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { z } from 'zod';

// Request DTOs for create and update
const CreateDeathVerificationRequestSchema = z.object({
  userId: z.string().uuid(),
  verificationData: z.record(z.any()),
});

const UpdateDeathVerificationStatusRequestSchema = z.object({
  status: z.nativeEnum(DeathVerificationStatus),
  reviewerId: z.string().uuid(),
  reviewerNotes: z.record(z.any()).optional(),
});


@Controller('death-verification')
export class DeathVerificationController {
  constructor(private readonly deathVerificationService: DeathVerificationService) {}

  @Post()
  async createRequest(
    @Body(new ZodValidationPipe(CreateDeathVerificationRequestSchema))
    body: z.infer<typeof CreateDeathVerificationRequestSchema>,
    @Req() req: any, // Assuming correlationId is attached to req
  ): Promise<DeathVerification> {
    const correlationId = req.correlationId || '';
    return this.deathVerificationService.createVerificationRequest(
      body.userId,
      body.verificationData,
      correlationId
    );
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateDeathVerificationStatusRequestSchema))
    body: z.infer<typeof UpdateDeathVerificationStatusRequestSchema>,
    @Req() req: any,
  ): Promise<DeathVerification> {
    const correlationId = req.correlationId || '';
    return this.deathVerificationService.updateVerificationStatus(
      id,
      body.status,
      body.reviewerId,
      body.reviewerNotes || {},
      correlationId
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<DeathVerification> {
    return this.deathVerificationService.getVerificationById(id);
  }

  @Get()
  async getAll(): Promise<DeathVerification[]> {
    return this.deathVerificationService.getAllVerifications();
  }
}
