import { IInMemoryDataServices } from '@core/abstracts/in-memory-data-services.abstract'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { PREFIX_KEY_REDIS } from './constant/key.constant'

@Injectable()
export class RedisClientService implements IInMemoryDataServices {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async setKey(key: string, value: string | number | Buffer) {
    await this.redisClient.set(key, value)
  }

  async getKey(key: string): Promise<string> {
    return await this.redisClient.get(key)
  }

  async deleteKey(key: string) {
    await this.redisClient.del(key)
  }

  async createCuckooFilter(filter_name: string, capacity = 1000) {
    await this.redisClient.call('CF.RESERVE', filter_name, capacity)
  }

  async addToCuckooFilter(filter_name: string, value: any) {
    await this.redisClient.call('CF.ADD', filter_name, value)
  }

  async checkExistCuckooFilter(filter_name: string, key: any) {
    const result = await this.redisClient.call('CF.EXISTS', filter_name, key)
    return result === 1 ? true : false
  }

  public getUserKeyName(user_id: string, prefixKey: string): string {
    switch (prefixKey) {
      case PREFIX_KEY_REDIS.USER_COCKOO_FILTER:
        return `${prefixKey}${user_id}`
      case PREFIX_KEY_REDIS.USER_RANDOM_CHAT_ONLINE:
        return `${prefixKey}${user_id}`
      case PREFIX_KEY_REDIS.USER_RANDOM_VOICE_ONLINE:
        return `${prefixKey}${user_id}`
      default:
        return ''
    }
  }
}
