import { NestFactory } from '@nestjs/core'
import { MqttOptions, Transport } from '@nestjs/microservices'
import { WebsocketSubscriberModule } from './websocket-subscriber.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MqttOptions>(WebsocketSubscriberModule, {
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883',
    },
  })

  await app.listen()
}
bootstrap()
