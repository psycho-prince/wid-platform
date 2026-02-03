import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DeathVerificationStatus } from '../../src/death-verification/death-verification.entity';
import { v4 as uuidv4 } from 'uuid';
import { AuditClientService } from '../../src/common/clients/audit-client.service';
import { InheritanceClientService } from '../../src/common/clients/inheritance-client.service';
import { AssetVaultClientService } from '../../src/common/clients/asset-vault-client.service';
import { NotificationClientService } from '../../src/common/clients/notification-client.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto'; // Import crypto module

describe('DeathVerificationService (e2e)', () => {
  let app: INestApplication;
  let auditClientService: AuditClientService;
  let inheritanceClientService: InheritanceClientService;
  let assetVaultClientService: AssetVaultClientService;
  let notificationClientService: NotificationClientService;
  let configService: ConfigService;

  beforeEach(async () => {
    // Mock the external service clients
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuditClientService)
      .useValue({ sendAuditLog: jest.fn(() => Promise.resolve({})) })
      .overrideProvider(InheritanceClientService)
      .useValue({ evaluateRules: jest.fn(() => Promise.resolve({})) })
      .overrideProvider(AssetVaultClientService)
      .useValue({ markAssetsAsReleasable: jest.fn(() => Promise.resolve({})) })
      .overrideProvider(NotificationClientService)
      .useValue({ sendNotification: jest.fn(() => Promise.resolve({})) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    auditClientService = moduleFixture.get<AuditClientService>(AuditClientService);
    inheritanceClientService = moduleFixture.get<InheritanceClientService>(InheritanceClientService);
    assetVaultClientService = moduleFixture.get<AssetVaultClientService>(AssetVaultClientService);
    notificationClientService = moduleFixture.get<NotificationClientService>(NotificationClientService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    // Mock the INTERNAL_SERVICE_SECRET for HMAC validation in middleware
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'INTERNAL_SERVICE_SECRET') {
            return 'test-secret'; // Use a consistent test secret
        }
        return process.env[key]; // Fallback for other config keys
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a death verification request', async () => {
    const userId = uuidv4();
    const verificationData = {
      deathCertificateId: 'DC-12345',
      source: 'government-registry',
    };
    const correlationId = uuidv4();

    const timestamp = Date.now().toString();
    const bodyHash = crypto.createHash('sha256').update(JSON.stringify({ userId, verificationData })).digest('hex');
    const canonicalString = [
        'POST',
        '/death-verification', // Corrected path to match controller's route
        timestamp,
        bodyHash,
        userId,
        // No userEmail as it's not passed here directly for this call
    ].join('\n');
    const signature = crypto.createHmac('sha256', 'test-secret').update(canonicalString).digest('hex');


    const res = await request(app.getHttpServer())
      .post('/api/death-verification') // Using global prefix
      .send({ userId, verificationData })
      .set('x-internal-signature', signature)
      .set('x-internal-timestamp', timestamp)
      .set('x-user-id', userId)
      .set('x-correlation-id', correlationId)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.userId).toEqual(userId);
    expect(res.body.status).toEqual(DeathVerificationStatus.PENDING_REVIEW);
    expect(auditClientService.sendAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
            action: 'DEATH_VERIFICATION_REQUESTED',
            actorId: userId,
            correlationId: correlationId,
        }),
    );
  });

  it('should transition death verification to VERIFIED and trigger downstream actions', async () => {
    const userId = uuidv4();
    const reviewerId = uuidv4();
    const correlationId = uuidv4();

    // 1. Create a request first
    const createTimestamp = Date.now().toString();
    const createBodyHash = crypto.createHash('sha256').update(JSON.stringify({ userId, verificationData: { test: 'data' } })).digest('hex');
    const createCanonicalString = [
        'POST',
        '/death-verification',
        createTimestamp,
        createBodyHash,
        userId,
    ].join('\n');
    const createSignature = crypto.createHmac('sha256', 'test-secret').update(createCanonicalString).digest('hex');

    const createRes = await request(app.getHttpServer())
      .post('/api/death-verification')
      .send({ userId, verificationData: { test: 'data' } })
      .set('x-internal-signature', createSignature)
      .set('x-internal-timestamp', createTimestamp)
      .set('x-user-id', userId)
      .set('x-correlation-id', correlationId)
      .expect(201);

    const verificationId = createRes.body.id;

    // 2. Update status to VERIFIED
    const updateTimestamp = Date.now().toString();
    const updateBody = {
        status: DeathVerificationStatus.VERIFIED,
        reviewerId: reviewerId,
        reviewerNotes: { adminNote: 'Approved by test admin' },
    };
    const updateBodyHash = crypto.createHash('sha256').update(JSON.stringify(updateBody)).digest('hex');
    const updateCanonicalString = [
        'PUT',
        `/death-verification/${verificationId}/status`,
        updateTimestamp,
        updateBodyHash,
        reviewerId, // Actor is reviewer for this action
    ].join('\n');
    const updateSignature = crypto.createHmac('sha256', 'test-secret').update(updateCanonicalString).digest('hex');

    const updateRes = await request(app.getHttpServer())
      .put(`/api/death-verification/${verificationId}/status`)
      .send(updateBody)
      .set('x-internal-signature', updateSignature)
      .set('x-internal-timestamp', updateTimestamp)
      .set('x-user-id', reviewerId) // Reviewer is the actor
      .set('x-correlation-id', correlationId)
      .expect(200);

    expect(updateRes.body.status).toEqual(DeathVerificationStatus.VERIFIED);
    expect(updateRes.body.verifiedAt).toBeDefined();

    // Verify downstream clients were called
    expect(auditClientService.sendAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
            action: 'DEATH_VERIFICATION_STATUS_UPDATED_VERIFIED',
            actorId: reviewerId,
            correlationId: correlationId,
        }),
    );
    expect(inheritanceClientService.evaluateRules).toHaveBeenCalledWith(userId, correlationId);
    expect(assetVaultClientService.markAssetsAsReleasable).toHaveBeenCalledWith(userId, correlationId);
    expect(notificationClientService.sendNotification).toHaveBeenCalledWith(
        userId,
        'death_verified',
        'Your death has been verified. Inheritance process initiated.',
        correlationId,
    );
  });
});