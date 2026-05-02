import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntasModule } from './preguntas/preguntas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'practica-3',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    PreguntasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}