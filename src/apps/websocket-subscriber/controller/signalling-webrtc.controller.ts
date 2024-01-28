import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMqttClientService } from '@core/abstracts/mqtt-client-services.abstract'
import { MQTTAuthGuard } from '@guards/mqtt-authentication.guard'
import { Controller, UseGuards } from '@nestjs/common'
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices'

@Controller()
export class SignallingWebRTCController {
  constructor(
    private readonly logger: ILoggerService,
    private readonly mqttClientService: IMqttClientService,
  ) {}

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('signal-ready/from/+/to/+')
  handldeSignalReady(@Payload() data, @Ctx() context: MqttContext) {
    this.logger.info('handldeSignalReady', { data })
    console.log(data)
    console.log(context.getTopic())
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('signal-offer/from/+/to/+')
  handldeSignalOffer(@Payload() data, @Ctx() context: MqttContext) {
    console.log(data)
    console.log(context.getTopic())
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('signal-answer/from/+/to/+')
  handldeSignalAnswer(@Payload() data, @Ctx() context: MqttContext) {
    console.log(data)
    console.log(context.getTopic())
  }

  @UseGuards(MQTTAuthGuard)
  @MessagePattern('signal-candidate/from/+/to/+')
  handldeSignalCandidate(@Payload() data, @Ctx() context: MqttContext) {
    console.log(data)
    console.log(context.getTopic())
  }
}
