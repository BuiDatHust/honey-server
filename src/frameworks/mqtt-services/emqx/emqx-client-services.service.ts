import { ConfigurationService } from '@configuration/configuration.service'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { IMqttClientService } from '@core/abstracts/mqtt-client-services.abstract'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { MqttClient, connect } from 'mqtt'

@Injectable()
export class EmqxService implements OnModuleInit, IMqttClientService {
  private mqttClient: MqttClient

  constructor(
    private readonly configService: ConfigurationService,
    private readonly logger: ILoggerService,
  ) {}

  onModuleInit() {
    this.logger.setContext(EmqxService.name)
    const host = this.configService.get<string>('emqx.host')
    const port = this.configService.get<string>('emqx.port')
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

    const connectUrl = `mqtt://${host}:${port}`
    this.mqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    })

    const logg = this.logger
    this.mqttClient.on('connect', function () {
      logg.info('Connected to EMQX')
    })

    this.mqttClient.on('error', function () {
      logg.error('Error in connecting to EMQX')
    })
  }

  publish(topic: string, payload: string): string {
    this.logger.info(`Publishing to ${topic}`)
    this.mqttClient.publish(topic, payload)
    return `Publishing to ${topic}`
  }
}
