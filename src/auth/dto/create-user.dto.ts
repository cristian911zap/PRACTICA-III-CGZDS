import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
    example: 'Carlos',
    description: 'Nombre del usuario',
    })
    @IsString()
    name!: string; 

    @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del usuario',
    })
    @IsString()
    @IsEmail()
    email!: string; 

    @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
    })
    @IsString()
    @MinLength(8)
    password!: string; 
}