import { ConfigurationModule } from '@configuration/configuration.module'
import { Module } from '@nestjs/common'
import { LoggerServiceModule } from '@services/logger-services/logger-services.module'

@Module({
  imports: [LoggerServiceModule, ConfigurationModule.forRoot()],
  controllers: [],
})
export class NotificationWorkerModule {}
