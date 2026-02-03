
import { Controller, Post, Body, Req, UsePipes } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { z } from 'zod';

const SendNotificationRequestSchema = z.object({
    userId: z.string().uuid(),
    type: z.string().min(1),
    message: z.string().min(1),
});

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @UsePipes(new ZodValidationPipe(SendNotificationRequestSchema))
  async sendNotification(
    @Body() body: z.infer<typeof SendNotificationRequestSchema>,
    @Req() req: any, // Assuming correlationId is attached to req
  ): Promise<any> {
    const correlationId = req.correlationId || '';
    return this.notificationService.sendNotification(body.userId, body.type, body.message, correlationId);
  }
}
