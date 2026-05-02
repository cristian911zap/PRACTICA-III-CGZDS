// dto/update-pregunta.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePreguntaDto } from './create-pregunta.dto';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdatePreguntaDto extends PartialType(CreatePreguntaDto) {
  @IsUUID()
  @IsOptional()
  id?: string;
}
