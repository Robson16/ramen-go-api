import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ImageFactory } from 'test/factories/image-factory';

describe('Create broth (e2e)', () => {
  let app: INestApplication;
  let imageFactory: ImageFactory;
  let prisma: PrismaService;
  let env: EnvService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ImageFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    imageFactory = moduleRef.get(ImageFactory);
    prisma = moduleRef.get(PrismaService);
    env = moduleRef.get(EnvService);

    await app.init();
  });

  test('[POST] /broths', async () => {
    const imageActive = await imageFactory.makePrismaImage();
    const imageInactive = await imageFactory.makePrismaImage();

    const response = await request(app.getHttpServer())
      .post('/broths')
      .set('x-api-key', env.get('API_KEY'))
      .send({
        name: 'Salt',
        description: 'Simple like the seawater, nothing more.',
        price: 10,
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      });

    console.log('API KEY: ' + env.get('API_KEY'));
    console.log('Status: ' + response.statusCode);

    expect(response.statusCode).toBe(201);

    const brothOnDatabase = await prisma.broth.findUnique({
      where: {
        name: 'Salt',
      },
    });

    expect(brothOnDatabase).toBeTruthy();
  });
});
