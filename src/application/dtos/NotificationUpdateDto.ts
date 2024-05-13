import { IsString } from "class-validator";

export class NotificationUpdateDto {
  @IsString({ message: "Name must be a string" })
  name?: string;

  @IsString({ message: "Description must be a string" })
  description?: string;
}
