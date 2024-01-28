import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { TYPE_MATCH_MAKING } from '@frameworks/data-servies/mongodb/constant/match-making.constant'
import { TOPIC_RABBITMQ } from '@frameworks/message-broker-services/rabbitmq/constant/topic.constant'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { MatchMakingMessageDto } from '@use-cases/random-matching/dto/match-making-message.dto'
import { RandomMatchingUsecase } from '@use-cases/random-matching/random-matching.use-case'
import { Channel, ChannelWrapper, connect } from 'amqp-connection-manager'
import { validate } from 'class-validator'

@Injectable()
export class MatchMakingController implements OnModuleInit {
  private channelWrapper: ChannelWrapper

  constructor(
    private readonly logger: ILoggerService,
    private readonly randomMatchingUsecase: RandomMatchingUsecase,
  ) {}

  public async onModuleInit() {
    const connection = connect('amqp://localhost:5672', {
      heartbeatIntervalInSeconds: 1,
    })
    this.channelWrapper = connection.createChannel()

    try {
      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.MATCH_MAKING_CHAT_TEXT, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.MATCH_MAKING_CHAT_TEXT, async message => {
          if (message) {
            const content: MatchMakingMessageDto = JSON.parse(message.content.toString())
            await this._handleMatchMakingChatText(message, content, channel)
          }
        })
      })

      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(TOPIC_RABBITMQ.MATCH_MAKING_CHAT_VOICE, { durable: true })

        await channel.consume(TOPIC_RABBITMQ.MATCH_MAKING_CHAT_VOICE, async message => {
          if (message) {
            const content: MatchMakingMessageDto = JSON.parse(message.content.toString())
            await this._handleMatchMakingChatVoice(message, content, channel)
          }
        })
      })

      this.logger.info('Consumer service started and listening for messages.')
    } catch (err) {
      this.logger.error('Error starting the consumer:', err)
    }
  }

  private async _handleMatchMakingChatText(
    message: string,
    payload: MatchMakingMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, 'handleMatchMakingChatText')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.randomMatchingUsecase.handleMatchMaking(
        payload.user_id,
        payload.match_making_request_id,
        TYPE_MATCH_MAKING.RANDOM_CHAT,
      )
    } catch (error) {
      this.logger.error(error, 'handleMatchMakingChatText')
      channel.nack(message, true, true)
    }

    channel.ack(message)
    this.logger.info('handleMatchMakingChatText successfully!')
  }

  private async _handleMatchMakingChatVoice(
    message: string,
    payload: MatchMakingMessageDto,
    channel: Channel,
  ) {
    this.logger.info({ payload }, 'handleMatchMakingChatVoice')

    const errors = await validate(payload)
    if (errors.length) {
      channel.ack(message)
      return
    }

    try {
      await this.randomMatchingUsecase.handleMatchMaking(
        payload.user_id,
        payload.match_making_request_id,
        TYPE_MATCH_MAKING.RANDOM_CHAT,
      )
    } catch (error) {
      this.logger.error(error, 'handleMatchMakingChatVoice')
      channel.nack(message, true, true)
      return
    }

    channel.ack(message)
    this.logger.info('handleMatchMakingChatVoice successfully!')
  }
}
