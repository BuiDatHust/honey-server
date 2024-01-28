import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { MediaApiModule } from './media-api.module'

async function bootstrap() {
  const app = await NestFactory.create(MediaApiModule)

  const logger = app.get(Logger)
  app.useLogger(logger)

  app.setGlobalPrefix('/media-api')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Honey media api')
    .setDescription('The honey API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = process.env.MEDIA_API_PORT || 3002
  await app.listen(port, () => {
    logger.log(`Media-api is listening on port ${port}`)
  })
}
bootstrap()
