import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    name!: string; 

    @ApiProperty()
    @IsString()
    @IsEmail()
    email!: string; 

    @ApiProperty()
    @IsString()
    @MinLength(8)
    password!: string; 
}