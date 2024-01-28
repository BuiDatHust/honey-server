import { IDataServices } from '@core/abstracts'
import { IInAppNotificationServices } from '@core/abstracts/in-app-notification.abstract'
import { IMailServices } from '@core/abstracts/mail-services.abstract'
import { ISmsServices } from '@core/abstracts/sms-services.abstract'
import {
  NOTIFICATION_STATUS,
  NOTIFICATION_USECASE_TYPE,
} from '@frameworks/data-servies/mongodb/constant/notification-log.constant'
import { USER_STATUS } from '@frameworks/data-servies/mongodb/constant/user.constant'
import { TYPE_SMS } from '@frameworks/sms-services/twilio/constant/twilio.constant'
import { Injectable } from '@nestjs/common'
import { SendMailMktLoyaltyCoinMessage } from './dto/send-mail-mkt-loyalty-coin-message.dto'
import { SendMailNewMatchMessageDto } from './dto/send-mail-new-match-message.dto'
import { SendMailNewChatMessageDto } from './dto/send-mail-new-message-message.dto'
import { SendMailOnboardPendingMessageDto } from './dto/send-mail-onboard-pending-message.dto'

@Injectable()
export class NotificationUsecase {
  constructor(
    private readonly dataService: IDataServices,
    private readonly smsService: ISmsServices,
    private readonly mailService: IMailServices,
    private readonly inAppNotificationService: IInAppNotificationServices,
  ) {}

  public async handleSendSmsNoti(notificationUsecaseType: string, data) {
    try {
      const isEnableConsume = await this._isEnableToConsumeNotification(data.notifcation_log_id)
      if (!isEnableConsume) {
        return
      }

      switch (notificationUsecaseType) {
        case NOTIFICATION_USECASE_TYPE.SMS_OTP_LOGIN:
          await this.smsService.sendSMS({
            type_sms: TYPE_SMS.MANUAL_LOGIN,
            to_phone_number: data.phone,
            data: data.payload,
          })
        case NOTIFICATION_USECASE_TYPE.SMS_OTP_REGISTER:
          await this.smsService.sendSMS({
            type_sms: TYPE_SMS.REGISTER_OTP,
            to_phone_number: data.phone,
            data: data.payload,
          })
        default:
          break
      }
    } catch (error) {
      await this.dataService.notificationLog.update(data.notifcation_log_id, {
        status: NOTIFICATION_STATUS.ERROR,
      })
      throw error
    }
  }

  public async handleSendEmailNoti(notificationUsecaseType: string, data) {
    try {
      const isEnableConsume = await this._isEnableToConsumeNotification(data.notifcation_log_id)
      if (!isEnableConsume) {
        return
      }

      const userId = data.user_id
      if (!userId) {
        return
      }
      const user = await this.dataService.users.getOneWithPopulateField(
        {
          _id: userId,
          status: { $nin: [USER_STATUS.BANNED, USER_STATUS.DELETED, USER_STATUS.HIDE] },
        },
        [{ path: 'notification_setting', strictPopulate: false }],
      )
      if (!user) {
        return
      }
      const notification = await this.dataService.notificationSettings.getOne({ user_id: userId })

      switch (notificationUsecaseType) {
        case NOTIFICATION_USECASE_TYPE.MAIL_MKT_LOYALTY_COIN:
          await this.mailService.sendMail<SendMailMktLoyaltyCoinMessage>({
            to: user.email,
            subject: 'New coin gift from Honey!',
            context: {
              coin: data.coin,
              user_id: user._id,
            },
            template: 'loyalty-coin-template.handlebars',
          })
        case NOTIFICATION_USECASE_TYPE.MAIL_NEW_MATCH:
          if (!notification.email_setting.is_send_new_match) {
            return
          }
          await this.mailService.sendMail<SendMailNewMatchMessageDto>({
            to: user.email,
            subject: 'New match from Honey!',
            context: {
              new_friend_id: data.new_friend_id,
              user_id: userId,
            },
            template: 'new-match-template.handlebars',
          })
        case NOTIFICATION_USECASE_TYPE.MAIL_NEW_MESSAGE:
          if (!notification.email_setting.is_send_new_message) {
            return
          }
          await this.mailService.sendMail<SendMailNewChatMessageDto>({
            to: user.email,
            subject: 'New message from Honey!',
            context: {
              chat_id: data.chat_id,
              user_id: userId,
            },
            template: 'new-message-template.handlebars',
          })
        case NOTIFICATION_USECASE_TYPE.MAIL_ONBOARD_PENDING:
          await this.mailService.sendMail<SendMailOnboardPendingMessageDto>({
            to: user.email,
            subject: 'Onboard pending from Honey!',
            context: {
              user_id: userId,
            },
            template: 'mail-onboard-pending.handlebars',
          })
        default:
          break
      }
    } catch (error) {
      await this.dataService.notificationLog.update(data.notifcation_log_id, {
        status: NOTIFICATION_STATUS.ERROR,
      })
      throw error
    }
  }

  public async handleSendMobileNoti(notificationUsecaseType: string, data) {
    try {
      const isEnableConsume = await this._isEnableToConsumeNotification(data.notifcation_log_id)
      if (!isEnableConsume) {
        return
      }

      const userId = data.user_id
      if (!userId) {
        return
      }
      const user = await this.dataService.users.getOneWithPopulateField(
        {
          _id: userId,
          status: { $nin: [USER_STATUS.BANNED, USER_STATUS.DELETED, USER_STATUS.HIDE] },
        },
        [{ path: 'notification_setting', strictPopulate: false }],
      )
      if (!user) {
        return
      }
      const notification = await this.dataService.notificationSettings.getOne({ user_id: userId })

      switch (notificationUsecaseType) {
        case NOTIFICATION_USECASE_TYPE.NOTI_APP_MKT_LOYALTY_COIN:
          if (!notification.push_notification_setting.is_send_new_match) {
            return
          }
          await this.inAppNotificationService.sendNotification({
            body: data.body,
            title: 'You recieved coin from honey app',
            userId: user._id,
          })
        case NOTIFICATION_USECASE_TYPE.NOTI_APP_NEW_MATCH:
          if (!notification.push_notification_setting.is_send_new_match) {
            return
          }
          await this.inAppNotificationService.sendNotification({
            body: data.body,
            title: 'You have new match in Honey',
            userId: user._id,
          })
        case NOTIFICATION_USECASE_TYPE.NOTI_APP_NEW_MESSAGE:
          if (!notification.push_notification_setting.is_send_new_message) {
            return
          }
          await this.inAppNotificationService.sendNotification({
            body: data.body,
            title: 'You have new message in Honey',
            userId: user._id,
          })
        default:
          break
      }

      await this.dataService.notificationLog.update(data.notifcation_log_id, {
        status: NOTIFICATION_STATUS.SENT,
      })
    } catch (error) {
      await this.dataService.notificationLog.update(data.notifcation_log_id, {
        status: NOTIFICATION_STATUS.ERROR,
      })
      throw error
    }
  }

  private async _isEnableToConsumeNotification(notifcation_log_id?: string): Promise<boolean> {
    if (!notifcation_log_id) {
      return false
    }
    const notificartionLog = await this.dataService.notificationLog.getById(notifcation_log_id)
    if (!notificartionLog || notificartionLog.status === NOTIFICATION_STATUS.SENT) {
      return false
    }

    return true
  }
}
