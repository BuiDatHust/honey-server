import { IDataServices } from '@core/abstracts'
import {
  TRANSACTION_STATUS,
  TYPE_TRANSACTION,
} from '@frameworks/data-servies/mongodb/constant/transaction.constant'
import { Subscription } from '@frameworks/data-servies/mongodb/models/subscription.model'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { addTimeToCurrentTime, getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import {
  SUBSCRIPTION_DURATION,
  SUBSCRIPTION_LEVEL,
  SUBSCRIPTION_TO_COIN,
  TYPE_SUBSCRIPTION_AND_FEATURE_TO_TRANSACTION,
} from './constant/subscription.constant'
import { RegiterSubscriptionRequestDto } from './dto/register-subscription-request.dto'
import { UpgradeSubscriptionRequestDto } from './dto/upgrade-subscription-request.dto'

@Injectable()
export class SubscriptionUsecase {
  constructor(private readonly dataService: IDataServices) {}

  public async registerSubscription(dto: RegiterSubscriptionRequestDto, userId: string) {
    const coin = SUBSCRIPTION_TO_COIN[dto.type_subscription][dto.duration]

    const wallet = await this.dataService.wallet.getOne({ user_id: new Types.ObjectId(userId) })
    if (!wallet || wallet.coin < coin) {
      throw new BadRequestException('Wallet is not enough!')
    }
    await this.dataService.wallet.update(wallet._id, { $inc: { coin: -coin } })
    const typeTransaction = TYPE_SUBSCRIPTION_AND_FEATURE_TO_TRANSACTION[dto.type_subscription]

    const existedSubscription = await this.dataService.subscription.getOne({
      user_id: new Types.ObjectId(userId),
      type_subscription: dto.type_subscription,
      expired_at: { $gt: getCurrentMilisecondTime() },
    })
    if (existedSubscription) {
      throw new BadRequestException('You already has this subscription!')
    }
    const expireAt = this._getExpireDateSubscription(dto.duration)
    const subscription = await this.dataService.subscription.create({
      user_id: new Types.ObjectId(userId),
      duration: dto.duration,
      type_subscription: dto.type_subscription,
      is_auto_extend: dto.is_auto_extend ? true : false,
      created_at: getCurrentMilisecondTime(),
      expired_at: expireAt,
    })
    await this.dataService.transaction.create({
      amount: -coin,
      subscription_id: subscription._id,
      created_at: getCurrentMilisecondTime(),
      type_transaction: typeTransaction,
      status: TRANSACTION_STATUS.SUCCESS,
    })
    return
  }

  public async cancelSubscription(subscriptionId: string, userId: string) {
    const currentTime = getCurrentMilisecondTime()
    const subscription = await this.dataService.subscription.getOne({
      _id: new Types.ObjectId(subscriptionId),
      user_id: new Types.ObjectId(userId),
      expired_at: { $gt: currentTime },
    })
    if (!subscription) {
      throw new BadRequestException('Subscription is not Exist!')
    }
    if (subscription.expired_at < currentTime) {
      throw new BadRequestException('Subscription is expired!')
    }

    if (subscription.is_auto_extend) {
      await this.dataService.subscription.update(subscription._id, { is_auto_extend: false })
    }
  }

  public getSubscriptions() {
    const subscriptions = SUBSCRIPTION_TO_COIN
    return subscriptions
  }

  public async getCurrentSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.dataService.subscription.getOne({
      user_id: new Types.ObjectId(userId),
      expired_at: { $gt: getCurrentMilisecondTime() },
    })
    if (!subscription) {
      throw new BadRequestException('Not exist subscription')
    }
    return subscription
  }

  public async upgradeSubscription(dto: UpgradeSubscriptionRequestDto, userId: string) {
    const currentTime = getCurrentMilisecondTime()
    const subscription = await this.dataService.subscription.getOne({
      _id: new Types.ObjectId(dto.subscription_id),
      user_id: new Types.ObjectId(userId),
    })
    if (!subscription) {
      throw new BadRequestException('Subscription is not Exist!')
    }
    if (subscription.expired_at < currentTime) {
      throw new BadRequestException('Subscription is expired!')
    }
    if (
      SUBSCRIPTION_LEVEL[subscription.type_subscription] >= SUBSCRIPTION_LEVEL[dto.type_subscription]
    ) {
      throw new BadRequestException('Subscription upgrade is less level than current subscription')
    }

    const paymentCoin = SUBSCRIPTION_TO_COIN[dto.type_subscription][dto.duration]
    const wallet = await this.dataService.wallet.getOne({ user_id: new Types.ObjectId(userId) })
    if (!wallet || wallet.coin < paymentCoin) {
      throw new BadRequestException('Wallet is not enough coin!')
    }

    const expireAt = this._getExpireDateSubscription(dto.duration)
    await this.dataService.subscription.update(subscription._id, { expired_at: currentTime })
    await this.dataService.wallet.update(wallet._id, {
      $inc: { coin: -paymentCoin },
    })
    await this.dataService.transaction.create({
      amount: -paymentCoin,
      created_at: getCurrentMilisecondTime(),
      type_transaction: TYPE_TRANSACTION.UPGRADE_SUBSCRIPTION,
      status: TRANSACTION_STATUS.SUCCESS,
    })
    await this.dataService.subscription.create({
      type_subscription: dto.type_subscription,
      duration: dto.duration,
      user_id: userId,
      is_auto_extend: dto.is_auto_extend ? true : false,
      expired_at: expireAt,
      created_at: getCurrentMilisecondTime(),
    })
  }

  private _getExpireDateSubscription(subscriptionDate: string) {
    let result = getCurrentMilisecondTime()

    switch (subscriptionDate) {
      case SUBSCRIPTION_DURATION.ONE_MONTH:
        result = addTimeToCurrentTime(1, 'months')
      case SUBSCRIPTION_DURATION.SIX_MONTH:
        result = addTimeToCurrentTime(6, 'months')
      case SUBSCRIPTION_DURATION.ONE_YEAR:
        result = addTimeToCurrentTime(1, 'years')
    }

    return result
  }
}
