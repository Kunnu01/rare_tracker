import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // setup OpenAPI (Swagger) documentation
  const config = new DocumentBuilder()
    .setTitle('Rare Tracker API')
    .setDescription(
      `
      In today’s fast-paced world, irregular sleeping habits are a common problem that affects health negatively.
      Well, wouldn’t it be great, if you can track your sleeping patterns in an app designed and coded by you?!
      The final product of this project should allow you to: upload, edit and delete sleep entries through API.
    `,
    )
    .setVersion('1.0')
    .addTag('Tracker')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
