export class UserSubscription {
  id?: number;
  userId: number;
  channelId: number;
  notificationId: number;

  constructor(
    userId: number,
    channelId: number,
    notificationId: number,
    id?: number
  ) {
    this.id = id;
    this.userId = userId;
    this.channelId = channelId;
    this.notificationId = notificationId;
  }
}
