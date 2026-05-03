// dto/update-movimiento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoDto } from './create-movimiento.dto';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdateMovimientoDto extends PartialType(CreateMovimientoDto) {
  @IsUUID()
  @IsOptional()
  id?: string;
}