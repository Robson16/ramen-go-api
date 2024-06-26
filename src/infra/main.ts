import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('RamenGO!')
    .setDescription(
      'This API allows users to list available broths, available proteins and place an order.',
    )
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'api-key',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port);
}

bootstrap();
