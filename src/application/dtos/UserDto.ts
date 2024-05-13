import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from "class-validator";

export class UserDto {
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "Phone number is required" })
  phoneNumber: string;

  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 20, {
    message: "Password must be between 6 and 20 characters long",
  })
  password: string;

  @IsOptional()
  @IsString({ message: "Role must be a string" })
  role: string;
}
