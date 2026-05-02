// dto/create-pregunta.dto.ts
import { IsString, IsNotEmpty, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Opcional: para documentación

export class CreatePreguntaDto {
  @ApiProperty({
    example: "opcion_multiple",
    description: 'Tipo de pregunta',
    required: true,
  })
  @IsNotEmpty({ message: 'El tipo de pregunta es obligatorio' })
  tipoPregunta!: string;

  @ApiProperty({
    example: '¿Cuál es la capital de Francia?',
    description: 'Texto de la pregunta',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'La pregunta es obligatoria' })
  pregunta!: string;

  @ApiProperty({
    example: 'París',
    description: 'Respuesta correcta',
    required: false,
  })
  @IsString()
  respuesta?: string;


  @ApiProperty({
    example: 5,
    description: 'Valor en puntos (1-100)',
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  valor?: number;
}
