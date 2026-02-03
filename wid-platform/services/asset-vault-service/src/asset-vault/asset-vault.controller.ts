
import { Controller, Post, Body, Req, Get, Param, UsePipes } from '@nestjs/common';
import { AssetVaultService } from './asset-vault.service';
import { z } from 'zod';
import { CreateAssetRequestSchema } from '@wid-platform/contracts';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Asset } from './asset.entity';

const MarkReleasableRequestSchema = z.object({
    userId: z.string().uuid(),
});

@Controller('asset-vault')
export class AssetVaultController {
  constructor(private readonly assetVaultService: AssetVaultService) {}

  @Post('mark-releasable')
  @UsePipes(new ZodValidationPipe(MarkReleasableRequestSchema))
  async markReleasable(
    @Body() body: z.infer<typeof MarkReleasableRequestSchema>,
    @Req() req: any, // Assuming correlationId is attached to req
  ): Promise<any> {
    const correlationId = req.correlationId || '';
    return this.assetVaultService.markAssetsAsReleasable(body.userId, correlationId);
  }

  @Post('assets')
  @UsePipes(new ZodValidationPipe(CreateAssetRequestSchema))
  async createAsset(
      @Body() body: z.infer<typeof CreateAssetRequestSchema>,
      @Req() req: any,
  ): Promise<Asset> {
      const { ownerId, name, type, encryptedDetails, description } = body;
      return this.assetVaultService.createAsset(ownerId, name, type, encryptedDetails, description);
  }

  @Get('assets/:ownerId')
  async getAssetsByOwner(@Param('ownerId') ownerId: string): Promise<Asset[]> {
      return this.assetVaultService.findAssetsByOwner(ownerId);
  }

  @Get('asset/:assetId')
  async getAssetById(@Param('assetId') assetId: string): Promise<Asset> {
      return this.assetVaultService.getAssetById(assetId);
  }
}
