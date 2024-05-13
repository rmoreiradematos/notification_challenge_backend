import { IsNotEmpty, IsInt } from "class-validator";

export class UserSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  channelId: number;

  @IsInt()
  @IsNotEmpty()
  notificationId: number;
}
