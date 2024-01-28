import { IDataServices } from '@core/abstracts'
import { Injectable } from '@nestjs/common'
import { getCurrentDay, getCurrentMilisecondTime } from 'src/helpers/datetime.helper'

@Injectable()
export class FeatureUsageUsecase {
  constructor(private readonly dataService: IDataServices) {}

  public async updateFeatureUsageCountCurrentDay(
    userId: string,
    incrementTotal: number,
    featureName: string,
  ) {
    const currentDay = getCurrentDay()
    const existedFeatureUsageCount = await this.dataService.featureUsageCount.getOne({
      user_id: userId,
      time: currentDay,
      feature_name: featureName,
    })
    if (!existedFeatureUsageCount) {
      await this.dataService.featureUsageCount.create({
        user_id: userId,
        time: currentDay,
        feature_name: featureName,
        total: 1,
        created_at: getCurrentMilisecondTime(),
      })
      return
    }

    const tempTotal = existedFeatureUsageCount.total + incrementTotal
    const newTotal = tempTotal > 0 ? tempTotal : 0
    await this.dataService.featureUsageCount.update(existedFeatureUsageCount._id, {
      total: newTotal,
    })
  }
}
