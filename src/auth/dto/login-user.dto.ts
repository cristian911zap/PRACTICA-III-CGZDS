import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsString() 
    @IsEmail()
    @ApiProperty()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty() 
    password!: string;
}