import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMqttClientService } from '@core/abstracts/mqtt-client-services.abstract'
import { SEND_MESSAGE_TOPIC } from '@frameworks/mqtt-services/emqx/constant/topic.constant'
import { MQTTAuthGuard } from '@guards/mqtt-authentication.guard'
import { validate } from '@nestjs/class-validator'
import { Controller, OnModuleInit, UseGuards } from '@nestjs/common'
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices'
import { ChatUsecase } from '@use-cases/chat/chat.use-case'
import { SendMessageDto } from '@use-cases/chat/dto/send-message.dto'

@Controller()
export class ChatController implements OnModuleInit {
  constructor(
    private readonly logger: ILoggerService,
    private readonly mqttClientService: IMqttClientService,
    private readonly chatUsecase: ChatUsecase,
  ) {}

  onModuleInit() {
    this.logger.setContext(ChatController.name)
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern(SEND_MESSAGE_TOPIC)
  async handldeSendMessage(@Payload() data: SendMessageDto, @Ctx() context: MqttContext) {
    this.logger.info({ data })
    const sender_user_id = context.getTopic().split('/')?.[1]
    if (!sender_user_id) {
      return
    }

    try {
      const errors = await validate(data)
      if (errors.length) {
        return
      }

      const message = await this.chatUsecase.handleSendMessage(data, sender_user_id)
      if (!message) {
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.mqttClientService.publish(`message/${data.chat_id}`, JSON.stringify(message))
    } catch (error) {
      this.logger.error({ error })
      this.mqttClientService.publish(
        `message/${sender_user_id}/error`,
        JSON.stringify({ msg: 'Server error' }),
      )
    }
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('react-message/+')
  handldeReactMessage(@Payload() data, @Ctx() context: MqttContext) {
    console.log(data)
    console.log(context.getTopic())
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('update-message/+')
  handldeUpdateMessage(@Payload() data, @Ctx() context: MqttContext) {
    console.log(data)
    console.log(context.getTopic())
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('delete-message/+')
  handldeDeleteMessage(@Payload() data, @Ctx() context: MqttContext) {
    console.log(data)
    console.log(context.getTopic())
  }
}
