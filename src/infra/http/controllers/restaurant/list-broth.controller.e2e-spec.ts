import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { BrothFactory } from 'test/factories/broth-factory';
import { ImageFactory } from 'test/factories/image-factory';

describe('List broth (e2e)', () => {
  let app: INestApplication;
  let brothFactory: BrothFactory;
  let imageFactory: ImageFactory;
  let env: EnvService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [BrothFactory, ImageFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    brothFactory = moduleRef.get(BrothFactory);
    imageFactory = moduleRef.get(ImageFactory);
    env = moduleRef.get(EnvService);

    await app.init();
  });

  test('[GET] /broths', async () => {
    const image01Active = await imageFactory.makePrismaImage();
    const image01Inactive = await imageFactory.makePrismaImage();

    const image02Active = await imageFactory.makePrismaImage();
    const image02Inactive = await imageFactory.makePrismaImage();

    await Promise.all([
      brothFactory.makePrismaBroth({
        name: 'Salt',
        imageActiveId: image01Active.id.toString(),
        imageInactiveId: image01Inactive.id.toString(),
      }),
      brothFactory.makePrismaBroth({
        name: 'Tonkotsu',
        imageActiveId: image02Active.id.toString(),
        imageInactiveId: image02Inactive.id.toString(),
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/broths')
      .set('x-api-key', env.get('API_KEY'))
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      broths: expect.arrayContaining([
        expect.objectContaining({ name: 'Salt' }),
        expect.objectContaining({ name: 'Tonkotsu' }),
      ]),
    });
  });
});
