import { ConfigurationModule } from '@configuration/configuration.module'
import { ConfigurationService } from '@configuration/configuration.service'
import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { RedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { RedisClientService } from './redis-client.service'

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (config: ConfigurationService) => ({
        config: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          pass: config.get('redis.password'),
          db: config.get('redis.index_db'),
        },
      }),
      inject: [ConfigurationService],
    }),
  ],
  providers: [
    {
      provide: IInMemoryDataServices,
      useClass: RedisClientService,
    },
  ],
  exports: [IInMemoryDataServices],
})
export class RedisClientModule {}
