import { IDataServices } from '@core/abstracts'
import { IInAppNotificationServices } from '@core/abstracts/in-app-notification.abstract'
import { ILoggerService } from '@core/abstracts/logger-services.abstract'
import { NOTIFICATION_TOKEN_STATUS } from '@frameworks/data-servies/mongodb/constant/notification-token.constant'
import { Injectable, OnModuleInit } from '@nestjs/common'
import * as firebase from 'firebase-admin'
import { Types } from 'mongoose'
import { ConfigurationService } from '@configuration/configuration.service'

@Injectable()
export class FirebaseFcmService implements IInAppNotificationServices, OnModuleInit {
  private firebaseClient: firebase.app.App

  constructor(
    private readonly logger: ILoggerService,
    private readonly dataService: IDataServices,
    private readonly configService: ConfigurationService
  ) {}

  onModuleInit() {
    const firebaseAdminCredential = this.configService.get('firebase.admin_credential') as string
    this.firebaseClient = firebase.initializeApp({
      credential: firebase.credential.cert(JSON.parse(firebaseAdminCredential)),
    })
  }

  public async sendNotification({
    userId,
    title,
    body,
    imageUrl = '',
  }: {
    userId: string
    title: string
    body: string
    imageUrl?: string
  }): Promise<void> {
    try {
      const notifications = await this.dataService.notificationToken.getByFilterWithPopulateField(
        {
          user_id: new Types.ObjectId(userId),
          status: NOTIFICATION_TOKEN_STATUS.ACTIVE,
        },
        'notification_token',
      )
      if (!notifications?.length) {
        return
      }

      await Promise.allSettled(
        notifications.map(notification =>
          this.firebaseClient.messaging().send({
            notification: { title, body, imageUrl },
            token: notification.notification_token,
            android: { priority: 'high' },
          }),
        ),
      )
    } catch (error) {
      this.logger.error({ error }, 'sendNotification')
    }
  }
}
