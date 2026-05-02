// pregunta.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn 
} from 'typeorm';

@Entity('preguntas')
export class Pregunta {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único de la pregunta (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: "OPCION_MULTIPLE",
    description: 'Tipo de pregunta',
  })
  @Column({
    type: 'varchar',
    nullable: false
  })
  tipoPregunta!: string;

  @ApiProperty({
    example: '¿Cuál es la capital de Francia?',
    description: 'Texto de la pregunta',
  })
  @Column({ type: 'text', nullable: false })
  pregunta!: string; // La pregunta en sí

  @ApiProperty({
    example: 'París',
    description: 'Respuesta correcta',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  respuesta!: string; // Respuesta (opcional)

  @ApiProperty({
    example: 5,
    description: 'Valor en puntos (máximo 100)',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  valor!: number; // Valor en puntos

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que creó la pregunta',
  })
  @Column({ type: 'int', nullable: false })
  usuarioId!: number;
}
