import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { BrothFactory } from 'test/factories/broth-factory';
import { ImageFactory } from 'test/factories/image-factory';
import { ProteinFactory } from 'test/factories/protein-factory';

describe('Create order (e2e)', () => {
  let app: INestApplication;
  let imageFactory: ImageFactory;
  let brothFactory: BrothFactory;
  let proteinFactory: ProteinFactory;
  let prisma: PrismaService;
  let env: EnvService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ImageFactory, BrothFactory, ProteinFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    imageFactory = moduleRef.get(ImageFactory);
    brothFactory = moduleRef.get(BrothFactory);
    proteinFactory = moduleRef.get(ProteinFactory);
    prisma = moduleRef.get(PrismaService);
    env = moduleRef.get(EnvService);

    await app.init();
  });

  test('[POST] /orders', async () => {
    const [imageActive, imageInactive] = await Promise.all([
      imageFactory.makePrismaImage(),
      imageFactory.makePrismaImage(),
    ]);

    const [broth, protein] = await Promise.all([
      brothFactory.makePrismaBroth({
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      }),
      proteinFactory.makePrismaProtein({
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      }),
    ]);

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('x-api-key', env.get('API_KEY'))
      .send({
        brothId: broth.id.toString(),
        proteinId: protein.id.toString(),
      });

    expect(response.statusCode).toBe(201);

    const order = response.body;

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id,
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
