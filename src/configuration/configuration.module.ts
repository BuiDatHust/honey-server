import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import configuration from './configuration'
import { ConfigurationService } from './configuration.service'

@Module({})
export class ConfigurationModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: ConfigurationModule,
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [ConfigurationService],
      exports: [ConfigurationService],
    }
  }
}
