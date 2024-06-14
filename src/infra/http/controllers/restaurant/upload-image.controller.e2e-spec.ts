import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Upload Image (e2e)', () => {
  let app: INestApplication;
  let env: EnvService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    env = moduleRef.get(EnvService);

    await app.init();
  });

  test('[POST] /images', async () => {
    const response = await request(app.getHttpServer())
      .post('/images')
      .set('x-api-key', env.get('API_KEY'))
      .attach('file', './test/e2e/sample-upload.svg');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      imageId: expect.any(String),
    });
  });
});
