import { IMqttClientService } from '@core/abstracts/mqtt-client-services.abstract'
import { Module } from '@nestjs/common'
import { EmqxService } from './emqx-client-services.service'

@Module({
  imports: [],
  providers: [
    {
      provide: IMqttClientService,
      useClass: EmqxService,
    },
  ],
  exports: [IMqttClientService],
})
export class EmqxClientModule {}
