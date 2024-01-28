import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get environment variable
   * @param key
   * @returns T if key is defined, otherwise throw an error
   */
  public get<T>(key: string): T {
    const result = this.configService.get(key)

    if (result === undefined || result === null) {
      throw new Error(`Environment variable ${key} is not defined`)
    }
    return result
  }
}
