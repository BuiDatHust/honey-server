export abstract class IInAppNotificationServices {
  abstract sendNotification({
    userId,
    title,
    body,
    imageUrl,
  }: {
    userId: string
    title: string
    body: string
    imageUrl?: string
  }): Promise<void>
}
