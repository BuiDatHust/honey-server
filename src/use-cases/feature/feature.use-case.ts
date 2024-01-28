import { IDataServices } from '@core/abstracts'
import { TRANSACTION_STATUS } from '@frameworks/data-servies/mongodb/constant/transaction.constant'
import { BadRequestException, Injectable } from '@nestjs/common'
import { FeatureUsageUsecase } from '@use-cases/feature-usage/feature-usage.use-case'
import { FEATURE_TO_COIN } from '@use-cases/subscription/constant/subscription.constant'
import { WalletUsecase } from '@use-cases/wallet/wallet.use-case'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { FEATURE_TO_TRANSACTION_TYPE } from './constant/feature.constant'
import { BuyFeatureRequestDto } from './dto/buy-feature-request.dto'

@Injectable()
export class FeatureUsecase {
  constructor(
    private readonly dataService: IDataServices,
    private readonly walletUsecase: WalletUsecase,
    private readonly featureUsageUsecase: FeatureUsageUsecase,
  ) {}

  async buy(dto: BuyFeatureRequestDto, userId: string) {
    const payCoin = dto.num_of_feature_usage * FEATURE_TO_COIN[dto.type_feature]
    const wallet = await this.walletUsecase.isUserAvailableToPay(userId, payCoin)
    if (!wallet) {
      throw new BadRequestException('wallet is not enough coin!')
    }

    const typeTransaction = FEATURE_TO_TRANSACTION_TYPE[dto.type_feature]
    if (!typeTransaction) {
      throw new BadRequestException('Not exist plan buy for this feature!')
    }

    await this.dataService.wallet.update(wallet._id, { $inc: { coin: -payCoin } })
    await this.featureUsageUsecase.updateFeatureUsageCountCurrentDay(
      userId,
      -dto.num_of_feature_usage,
      dto.type_feature,
    )
    await this.dataService.transaction.create({
      user_id: userId,
      amount: -payCoin,
      type_transaction: typeTransaction,
      status: TRANSACTION_STATUS.SUCCESS,
      created_at: getCurrentMilisecondTime(),
    })
  }
}
