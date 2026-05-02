// pregunta.entity.ts
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn 
} from 'typeorm';

@Entity('preguntas')
export class Pregunta {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  tipoPregunta!: string;

  @Column({ type: 'text', nullable: false })
  pregunta!: string; // La pregunta en sí

  @Column({ type: 'text', nullable: true })
  respuesta!: string; // Respuesta (opcional)

  @Column({ type: 'int', nullable: true })
  valor!: number; // Valor en puntos

  @Column({ type: 'int', nullable: false })
  usuarioId!: number;
}
