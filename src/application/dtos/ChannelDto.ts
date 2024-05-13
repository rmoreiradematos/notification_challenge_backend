import { IsNotEmpty, IsString } from "class-validator";

export class ChannelDto {
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @IsString({ message: "Description must be a string" })
  description: string;
}
