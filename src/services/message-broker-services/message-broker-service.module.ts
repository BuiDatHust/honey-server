import { RabbitMQClientModule } from '@frameworks/message-broker-services/rabbitmq/rabbitmq-client.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [RabbitMQClientModule],
  exports: [RabbitMQClientModule],
})
export class MessgaeBrokerServiceModule {}
