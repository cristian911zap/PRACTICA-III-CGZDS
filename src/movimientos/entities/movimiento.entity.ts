// movimiento.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn 
} from 'typeorm';

@Entity('movimientos')
export class Movimiento {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único del movimiento (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que crea el movimiento',
  })
  @Column({ type: 'int', nullable: false })
  emisor!: number;

  @ApiProperty({
    example: 1500.50,
    description: 'Cantidad de dinero transferida',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  suma!: number;

  @ApiProperty({
    example: 'Banco Santander',
    description: 'Banco que maneja el movimiento',
  })
  @Column({ type: 'varchar', nullable: false })
  banco!: string;

  @ApiProperty({
    example: 'transferencia',
    description: 'Tipo de movimiento: transferencia o abono',
  })
  @Column({ type: 'varchar', nullable: false })
  tipo!: string;
}