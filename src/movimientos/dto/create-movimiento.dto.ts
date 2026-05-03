// dto/create-movimiento.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovimientoDto {
  @ApiProperty({
    example: 1500.50,
    description: 'Cantidad de dinero transferida',
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  suma!: number;

  @ApiProperty({
    example: 'Banco Santander',
    description: 'Banco que maneja el movimiento',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  banco!: string;

  @ApiProperty({
    example: 'transferencia',
    description: 'Tipo de movimiento: transferencia o abono',
    required: true,
    enum: ['transferencia', 'abono']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['transferencia', 'abono'])
  tipo!: string;
}