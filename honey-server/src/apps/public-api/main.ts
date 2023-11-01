import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { PublicApiModule } from './public-api.module'

async function bootstrap() {
  const app = await NestFactory.create(PublicApiModule)

  const logger = app.get(Logger)
  app.useLogger(logger)

  app.setGlobalPrefix('/api')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Honey api')
    .setDescription('The honey API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = process.env.API_PORT || 3000
  await app.listen(port, () => {
    logger.log(`Public-api is listening on port ${port}`)
  })
}
bootstrap()
