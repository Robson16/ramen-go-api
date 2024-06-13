import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create broth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let env: EnvService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    env = moduleRef.get(EnvService);

    await app.init();
  });

  test('[POST] /broths', async () => {
    const response = await request(app.getHttpServer())
      .post('/broths')
      .set('x-api-key', env.get('API_KEY'))
      .send({
        name: 'Salt',
        description: 'Simple like the seawater, nothing more.',
        price: 10,
      });

    expect(response.statusCode).toBe(201);

    const brothOnDatabase = await prisma.broth.findUnique({
      where: {
        name: 'Salt',
      },
    });

    expect(brothOnDatabase).toBeTruthy();
  });
});
