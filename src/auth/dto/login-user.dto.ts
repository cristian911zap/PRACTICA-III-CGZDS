import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsString() 
    @IsEmail()
    @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del usuario',
    })
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
    })
    password!: string;
}