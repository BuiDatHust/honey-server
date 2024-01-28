import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { NOTIFICATION_USECASE_TYPE } from '@frameworks/data-servies/mongodb/constant/notification-log.constant'
import { TOPIC_RABBITMQ } from '@frameworks/message-broker-services/rabbitmq/constant/topic.constant'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { SendMailMktLoyaltyCoinMessage } from '@use-cases/notification/dto/send-mail-mkt-loyalty-coin-message.dto'
import { SendMailNewMatchMessageDto } from '@use-cases/notification/dto/send-mail-new-match-message.dto'
import { SendMailNewChatMessageDto } from '@use-cases/notification/dto/send-mail-new-message-message.dto'
import { NotificationUsecase } from '@use-cases/notification/notification.use-case'
import { Channel, ChannelWrapper, connect } from 'amqp-connection-manager'
import { validate } from 'class-validator'

@Injectable()
export class MailController implements OnModuleInit {
  private channelWrapper: ChannelWrapper

  constructor(
    private readonly logger: ILoggerService,
    private readonly notificationUsecase: NotificationUsecase,
  ) {}

  public async onModuleInit() {
    const connection = connect('amqp://localhost:5672', {
      heartbeatIntervalInSeconds: 1,
    })
    this.channelWrapper = connection.createChannel()

    try {
      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_MAIL_NOTI_LOYALTY, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_MAIL_NOTI_LOYALTY, async message => {
          if (message) {
            const content: SendMailMktLoyaltyCoinMessage = JSON.parse(message.content.toString())
            await this._handleSendMailLoyalty(message, content, channel)
          }
        })
      })

      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_MAIL_NOTI_NEW_MATCH, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_MAIL_NOTI_NEW_MATCH, async message => {
          if (message) {
            const content: SendMailNewMatchMessageDto = JSON.parse(message.content.toString())
            await this._handleSendMailNewMatch(message, content, channel)
          }
        })
      })

      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_MAIL_NOTI_NEW_MESSAGE, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_MAIL_NOTI_NEW_MESSAGE, async message => {
          if (message) {
            const content: SendMailNewChatMessageDto = JSON.parse(message.content.toString())
            await this._handleSendMailNewMessage(message, content, channel)
          }
        })
      })

      this.logger.info('Mail Consumer service started and listening for messages.')
    } catch (err) {
      this.logger.error('Error starting the consumer:', err)
    }
  }

  private async _handleSendMailLoyalty(
    message: string,
    payload: SendMailMktLoyaltyCoinMessage,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendMailLoyalty')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendMobileNoti(
        NOTIFICATION_USECASE_TYPE.MAIL_MKT_LOYALTY_COIN,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendMailLoyalty')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendMailLoyalty successfully!')
  }

  private async _handleSendMailNewMatch(
    message: string,
    payload: SendMailNewMatchMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendMailNewMatch')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendMobileNoti(
        NOTIFICATION_USECASE_TYPE.MAIL_NEW_MATCH,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendMailNewMatch')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendMailNewMatch successfully!')
  }

  private async _handleSendMailNewMessage(
    message: string,
    payload: SendMailNewChatMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendMailNewMessage')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendMobileNoti(
        NOTIFICATION_USECASE_TYPE.MAIL_NEW_MESSAGE,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendMailNewMessage')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendMailNewMessage successfully!')
  }
}
