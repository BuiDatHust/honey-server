import { IDataServices } from '@core/abstracts'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { RefreshToken } from '@frameworks/data-servies/mongodb/models/refresh-token.model'
import { Injectable } from '@nestjs/common'
import { CreateRefreshTokenDto } from '@use-cases/token/dto/create-refresh-token.dto'
import { RefreshTokenFactory } from './refresh-token.factory'

@Injectable()
export class RefreshTokenUsecase {
  constructor(
    private logger: ILoggerService,
    private dataService: IDataServices,
    private refreshTokenFactory: RefreshTokenFactory,
  ) {
    this.logger.setContext(RefreshToken.name)
  }

  public async create(dto: CreateRefreshTokenDto): Promise<RefreshToken> {
    this.logger.debug({ dto }, 'create')
    const attribute = this.refreshTokenFactory.createRefreshToken(dto)
    const data = await this.dataService.refreshTokens.create(attribute)

    return data
  }

  public async deleteByFilter(filter) {
    await this.dataService.refreshTokens.deleteByField(filter)
  }

  public async getOneByFilter(filter: any): Promise<RefreshToken | null> {
    const refreshToken = await this.dataService.refreshTokens.getOne(filter)
    return refreshToken
  }
}
