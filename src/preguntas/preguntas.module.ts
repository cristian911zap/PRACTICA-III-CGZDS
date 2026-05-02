import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { PreguntasController } from './preguntas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pregunta]),
    AuthModule,
  ],
  controllers: [PreguntasController],
  providers: [PreguntasService],
  exports: [PreguntasService]
})
export class PreguntasModule {}
