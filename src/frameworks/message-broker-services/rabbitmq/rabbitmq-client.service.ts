import { ConfigurationService } from '@configuration/configuration.service'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMessageBrokerService } from '@core/abstracts/message-broker-services.abstract'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Channel, ChannelWrapper, connect } from 'amqp-connection-manager'
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager'

@Injectable()
export class RabbitMQClientService implements OnModuleInit, IMessageBrokerService {
  private connection: IAmqpConnectionManager
  private channelWrapper: ChannelWrapper

  constructor(
    private readonly logger: ILoggerService,
    private readonly conf: ConfigurationService,
  ) {}

  public async publish(queue: string, payload: string) {
    const result = await this.channelWrapper.sendToQueue(queue, Buffer.from(payload), {
      timeout: 3600 * 2,
    })
    return result
  }

  async onModuleInit() {
    this.logger.setContext(RabbitMQClientService.name)

    const logg = this.logger
    const url = this.conf.get('rabbitmq.url')
    this.connection = connect(url, {
      heartbeatIntervalInSeconds: 1,
    })
    this.channelWrapper = this.connection.createChannel({
      confirm: true,
      setup: (channel: Channel) => {
        channel.assertQueue('match-making-chat-text', { durable: true })
        channel.assertQueue('match-making-chat-voice', { durable: true })
      },
    })

    this.connection.on('connect', function (connection: IAmqpConnectionManager, url: string) {
      logg.debug(connection.isConnected)
      logg.info(`connect rabbitmq ${url} successfull`)
    })

    this.connection.on('connectFailed', function (err: Error, url: string) {
      logg.error('Fail to connect to rabbitmq url:' + url, { err })
    })
  }
}
