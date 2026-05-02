import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
  JwtModule.register({
      global: true,
      secret: 'mifrasesupersecreta',
      signOptions: { expiresIn: '10m' },
    }),  
  TypeOrmModule.forFeature([User])], 
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}