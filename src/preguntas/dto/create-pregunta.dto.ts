// dto/create-pregunta.dto.ts
import { IsString, IsNotEmpty, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Opcional: para documentación

export class CreatePreguntaDto {
  @ApiProperty({ example: "Opcion multiple" })
  @IsNotEmpty({ message: 'El tipo de pregunta es obligatorio' })
  tipoPregunta!: string;

  @ApiProperty({ example: '¿Cuál es la capital de Francia?' })
  @IsString()
  @IsNotEmpty({ message: 'La pregunta es obligatoria' })
  pregunta!: string;

  @ApiProperty({ example: 'París', required: false })
  @IsString()
  respuesta?: string;

  @ApiProperty({ example: 5, required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  valor?: number;
}
