import { IsEmail, IsString, MinLength, IsEnum } from "class-validator"
import { UserRole } from "../../../common/enums/user-role.enum"

export class RegisterDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsEnum(UserRole)
  role: UserRole
}
