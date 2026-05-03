import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosModule } from './movimientos/movimientos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la app
      envFilePath: '.env', // Ruta del archivo .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'production', // Solo sincroniza en desarrollo
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MovimientosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}