import { IMessageBrokerService } from '@core/abstracts/message-broker-services.abstract'
import { Module } from '@nestjs/common'
import { RabbitMQClientService } from './rabbitmq-client.service'

@Module({
  imports: [],
  providers: [
    {
      provide: IMessageBrokerService,
      useClass: RabbitMQClientService,
    },
  ],
  exports: [IMessageBrokerService],
})
export class RabbitMQClientModule {}
