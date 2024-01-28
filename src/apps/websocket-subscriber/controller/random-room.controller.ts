import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMqttClientService } from '@core/abstracts/mqtt-client-services.abstract'
import { MQTTAuthGuard } from '@guards/mqtt-authentication.guard'
import { Controller, UseGuards } from '@nestjs/common'
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices'

@Controller()
export class RandomRoomController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly mqttClientService: IMqttClientService,
  ) {}

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('random-room/text/join/+')
  handldeJoinRandomText(@Payload() data, @Ctx() context: MqttContext) {
    this.logger.info('handldeJoinRandomText', { data })
    console.log(data)
    console.log(context.getTopic())
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('random-room/voice/join/+')
  handldeJoinRandomVoice(@Payload() data, @Ctx() context: MqttContext) {
    this.logger.info('handldeJoinRandomVoice', { data })
    console.log(data)
    console.log(context.getTopic())
  }
}
