import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { NOTIFICATION_USECASE_TYPE } from '@frameworks/data-servies/mongodb/constant/notification-log.constant'
import { TOPIC_RABBITMQ } from '@frameworks/message-broker-services/rabbitmq/constant/topic.constant'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { SendInAppLoyaltyMessageDto } from '@use-cases/notification/dto/send-inapp-noti-loyalty-message.dto'
import { SendInAppNotiNewMessageMessageDto } from '@use-cases/notification/dto/send-inapp-noti-new-match-message.dto'
import { SendInAppNotiNewMatchMessageDto } from '@use-cases/notification/dto/send-inapp-noti-new-message-message.dto'
import { NotificationUsecase } from '@use-cases/notification/notification.use-case'
import { Channel, ChannelWrapper, connect } from 'amqp-connection-manager'
import { validate } from 'class-validator'

@Injectable()
export class MobileController implements OnModuleInit {
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
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_INAPP_NOTI_LOYALTY, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_INAPP_NOTI_LOYALTY, async message => {
          if (message) {
            const content: SendInAppLoyaltyMessageDto = JSON.parse(message.content.toString())
            await this._handleSendInappLoyalty(message, content, channel)
          }
        })
      })

      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_INAPP_NOTI_NEW_MATCH, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_INAPP_NOTI_NEW_MATCH, async message => {
          if (message) {
            const content: SendInAppNotiNewMatchMessageDto = JSON.parse(message.content.toString())
            await this._handleSendInappNewMatch(message, content, channel)
          }
        })
      })

      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_INAPP_NOTI_NEW_MESSAGE, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_INAPP_NOTI_NEW_MESSAGE, async message => {
          if (message) {
            const content: SendInAppNotiNewMessageMessageDto = JSON.parse(
              message.content.toString(),
            )
            await this._handleSendInappNewMessage(message, content, channel)
          }
        })
      })

      this.logger.info('Mobile Consumer service started and listening for messages.')
    } catch (err) {
      this.logger.error('Error starting the consumer:', err)
    }
  }

  private async _handleSendInappLoyalty(
    message: string,
    payload: SendInAppLoyaltyMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendInappLoyalty')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendMobileNoti(
        NOTIFICATION_USECASE_TYPE.NOTI_APP_MKT_LOYALTY_COIN,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendInappLoyalty')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendInappLoyalty successfully!')
  }

  private async _handleSendInappNewMatch(
    message: string,
    payload: SendInAppNotiNewMatchMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendInappNewMatch')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendMobileNoti(
        NOTIFICATION_USECASE_TYPE.NOTI_APP_NEW_MATCH,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendInappNewMatch')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendInappNewMatch successfully!')
  }

  private async _handleSendInappNewMessage(
    message: string,
    payload: SendInAppNotiNewMessageMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendInappNewMessage')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendMobileNoti(
        NOTIFICATION_USECASE_TYPE.NOTI_APP_NEW_MESSAGE,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendInappNewMessage')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendInappNewMessage successfully!')
  }
}
