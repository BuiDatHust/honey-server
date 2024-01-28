import { ConfigurationService } from '@configuration/configuration.service'
import { IDataServices } from '@core/abstracts'
import {
  TRANSACTION_STATUS,
  TYPE_TRANSACTION,
} from '@frameworks/data-servies/mongodb/constant/transaction.constant'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { getCurrentMilisecondTime } from 'src/helpers/datetime.helper'
import { getPhoneWithCountryCode } from 'src/helpers/phone.helper'
import { USD_TO_COIN } from './constant/payment.constant'

@Injectable()
export class PaymentUsecase {
  constructor(
    private readonly configService: ConfigurationService,
    private readonly dataService: IDataServices,
  ) {}

  public async createOrder(userId: string, value: number) {
    const access_token = await this._getAccessToken()
    const environment = this.configService.get('paypal.environment')
    const endpoint_url =
      environment == 'sandbox'
        ? this.configService.get('paypal.sandbox_url')
        : this.configService.get('paypal.live_url')
    let order_data_json = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: value + '',
          },
        },
      ],
    }
    const data = JSON.stringify(order_data_json)

    const res = await fetch(endpoint_url + '/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: data,
    })
    const resJson = await res.json()
    await this.dataService.transaction.create({
      user_id: userId,
      amount: value,
      order_id: resJson.id,
      type_transaction: TYPE_TRANSACTION.BUY_COIN,
      status: TRANSACTION_STATUS.PROCCESSING,
      created_at: getCurrentMilisecondTime(),
    })
    return resJson
  }

  public async completeOrder(user_id: string, order_id: string) {
    const access_token = await this._getAccessToken()
    const environment = this.configService.get('paypal.environment')
    const endpoint_url =
      environment == 'sandbox'
        ? this.configService.get('paypal.sandbox_url')
        : this.configService.get('paypal.live_url')

    const transaction = await this.dataService.transaction.getOne({
      _id: new Types.ObjectId(order_id),
      user_id: new Types.ObjectId(user_id),
    })
    if (!transaction) {
      throw new BadRequestException('Order not found!')
    }

    const res = await fetch(endpoint_url + '/v2/checkout/orders/' + order_id + '/' + 'capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })
    const resJson = await res.json()
    const value = resJson?.purchase_units[0]?.payments[0]?.captures[0]?.amount?.value
    const captureId = resJson?.purchase_units[0]?.payments[0]?.captures[0]?.id
    if (!value || !captureId) {
      await this.dataService.transaction.update(order_id, { status: TRANSACTION_STATUS.SUCCESS })
      return resJson
    }

    await this.dataService.transaction.update(order_id, {
      status: TRANSACTION_STATUS.SUCCESS,
      capture_id: captureId,
    })
    await this.dataService.wallet.updateByFilter(
      { user_id: new Types.ObjectId(user_id) },
      {
        $inc: { coin: value * USD_TO_COIN },
      },
    )
    return resJson
  }

  public async cancelOrder(user_id: string, order_id: string) {
    const transaction = await this.dataService.transaction.getOne({
      _id: new Types.ObjectId(order_id),
      user_id: new Types.ObjectId(user_id),
    })
    if (!transaction) {
      throw new BadRequestException('Order not found!')
    }

    await this.dataService.transaction.update(order_id, { status: TRANSACTION_STATUS.CANCELED })
  }

  public async payout(userId: string, value: number): Promise<string> {
    const access_token = await this._getAccessToken()
    const environment = this.configService.get('paypal.environment')
    const endpoint_url =
      environment == 'sandbox'
        ? this.configService.get('paypal.sandbox_url')
        : this.configService.get('paypal.live_url')

    const user = await this.dataService.users.getById(userId)
    let payOutBody = {
      sender_batch_header: {
        email_subject: 'You have a payout at Honey!',
        email_message: 'You have received a payout! Thanks for using our service!',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: { value: value + '', currency: 'USD' },
          note: 'Thanks for your patronage!',
          receiver: '',
        },
      ],
    }
    if (user.is_verified_email) {
      payOutBody.items[0].recipient_type = 'EMAIL'
      payOutBody.items[0].receiver = user.email
    } else {
      payOutBody.items[0].recipient_type = 'PHONE'
      payOutBody.items[0].receiver = getPhoneWithCountryCode(user.phone_number, user.country_code)
    }
    const data = JSON.stringify(payOutBody)

    const res = await fetch(endpoint_url + '/v1/payments/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: data,
    })
    const resJson = await res.json()

    return resJson.batch_header?.payout_batch_id
  }

  private async _getAccessToken(): Promise<string> {
    const client_id = this.configService.get('paypal.client_id')
    const client_secret = this.configService.get('paypal.client_id')
    const environment = this.configService.get('paypal.environment')
    const endpoint_url =
      environment == 'sandbox'
        ? this.configService.get('paypal.sandbox_url')
        : this.configService.get('paypal.live_url')

    const auth = `${client_id}:${client_secret}`
    const data = 'grant_type=client_credentials'
    const res = await fetch(endpoint_url + '/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
      },
      body: data,
    })

    const body = await res.json()
    return body.access_token
  }
}
