// movimientos.module.ts
import { Module } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movimiento]),
    AuthModule,
  ],
  controllers: [MovimientosController],
  providers: [MovimientosService],
  exports: [MovimientosService]
})
export class MovimientosModule {}