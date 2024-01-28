import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { NOTIFICATION_USECASE_TYPE } from '@frameworks/data-servies/mongodb/constant/notification-log.constant'
import { TOPIC_RABBITMQ } from '@frameworks/message-broker-services/rabbitmq/constant/topic.constant'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { SensSmsLoginMessageDto } from '@use-cases/notification/dto/send-sms-login-message.dto'
import { SensSmsRegisterMessageDto } from '@use-cases/notification/dto/send-sms-register-message.dto'
import { NotificationUsecase } from '@use-cases/notification/notification.use-case'
import { Channel, ChannelWrapper, connect } from 'amqp-connection-manager'
import { validate } from 'class-validator'

@Injectable()
export class SmsController implements OnModuleInit {
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
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_SMS_LOGIN, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_SMS_LOGIN, async message => {
          if (message) {
            const content: SensSmsLoginMessageDto = JSON.parse(message.content.toString())
            await this._handleSendSmsLogin(message, content, channel)
          }
        })
      })

      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.SEND_SMS_REGISTER, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.SEND_SMS_REGISTER, async message => {
          if (message) {
            const content: SensSmsRegisterMessageDto = JSON.parse(message.content.toString())
            await this._handleSendSmsRegister(message, content, channel)
          }
        })
      })

      this.logger.info('Sms Consumer service started and listening for messages.')
    } catch (err) {
      this.logger.error('Error starting the consumer:', err)
    }
  }

  private async _handleSendSmsLogin(
    message: string,
    payload: SensSmsLoginMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendSmsLogin')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendSmsNoti(
        NOTIFICATION_USECASE_TYPE.SMS_OTP_LOGIN,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendSmsLogin')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendSmsLogin successfully!')
  }

  private async _handleSendSmsRegister(
    message: string,
    payload: SensSmsRegisterMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, '_handleSendSmsRegister')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.notificationUsecase.handleSendSmsNoti(
        NOTIFICATION_USECASE_TYPE.SMS_OTP_REGISTER,
        payload,
      )
    } catch (error) {
      this.logger.error(error, '_handleSendSmsRegister')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('_handleSendSmsRegister successfully!')
  }
}
