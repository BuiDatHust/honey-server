import { IDataServices } from '@core/abstracts'
import { Wallet } from '@frameworks/data-servies/mongodb/models/wallet.model'
import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class WalletUsecase {
  constructor(private readonly dataService: IDataServices) {}

  public async isUserAvailableToPay(userId: string, payCoin: number): Promise<Wallet> {
    const wallet = await this.dataService.wallet.getOne({ user_id: new Types.ObjectId(userId) })
    if (!wallet || wallet.coin < payCoin) {
      return
    }

    return wallet
  }
}
