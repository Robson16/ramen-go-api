import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'

import * as packageJson from '../../package.json'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
  })

  const config = new DocumentBuilder()
    .setTitle('RamenGO!')
    .setDescription(
      'RamenGO API for user accounts, JWT authentication, profile management, broth and protein catalog browsing, and custom ramen order creation. The platform also supports password recovery and image uploads for restaurant items.',
    )
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'kepler',
      layout: 'modern',
    }),
  )

  const envService = app.get(EnvService)
  const port = envService.get('APP_PORT')

  await app.listen(port)
}

bootstrap()
