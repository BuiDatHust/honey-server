import { RedisClientModule } from '@frameworks/in-memory-data-services/redis/redis-client.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [RedisClientModule],
  exports: [RedisClientModule],
})
export class InMemoryServiceModule {}
