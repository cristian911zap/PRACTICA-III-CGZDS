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
      host: 'mysql-8753c01-lacuentaalt54-f2431.l.aivencloud.com',
      port: 13861,
      username: 'avnadmin',
      password: 'AVNS_PV8s_DQgpkN-ejCNwLE',
      database: 'defaultdb',
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