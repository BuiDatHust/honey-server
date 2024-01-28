import { EmqxClientModule } from '@frameworks/mqtt-services/emqx/emqx-client.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [EmqxClientModule],
  exports: [EmqxClientModule],
})
export class MqttClientServiceModule {}
