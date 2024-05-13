export interface INotifier {
  sendNotification(userId: number, message: string): Promise<boolean>;
}
