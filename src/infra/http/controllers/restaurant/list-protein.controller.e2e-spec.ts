import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ImageFactory } from 'test/factories/image-factory';
import { ProteinFactory } from 'test/factories/protein-factory';

describe('List protein (e2e)', () => {
  let app: INestApplication;
  let proteinFactory: ProteinFactory;
  let imageFactory: ImageFactory;
  let env: EnvService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ProteinFactory, ImageFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    proteinFactory = moduleRef.get(ProteinFactory);
    imageFactory = moduleRef.get(ImageFactory);
    env = moduleRef.get(EnvService);

    await app.init();
  });

  test('[GET] /proteins', async () => {
    const image01Active = await imageFactory.makePrismaImage();
    const image01Inactive = await imageFactory.makePrismaImage();

    const image02Active = await imageFactory.makePrismaImage();
    const image02Inactive = await imageFactory.makePrismaImage();

    await Promise.all([
      proteinFactory.makePrismaProtein({
        name: 'Salt',
        imageActiveId: image01Active.id.toString(),
        imageInactiveId: image01Inactive.id.toString(),
      }),
      proteinFactory.makePrismaProtein({
        name: 'Tonkotsu',
        imageActiveId: image02Active.id.toString(),
        imageInactiveId: image02Inactive.id.toString(),
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/proteins')
      .set('x-api-key', env.get('API_KEY'))
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      proteins: expect.arrayContaining([
        expect.objectContaining({ name: 'Salt' }),
        expect.objectContaining({ name: 'Tonkotsu' }),
      ]),
    });
  });
});
