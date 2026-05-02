import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from './dto/response-token.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>,
  private jwtService: JwtService){
  }
  
  async create(createUserDto: CreateUserDto) {
    // Desestructurar 
    const numRound = 10

    const {email, password} = createUserDto; 
    // Verificar que el email no existe 
    const emailExist = await this.userRepo.findOneBy({email})
    if(emailExist){
      const error = {
        "statusCode": 409,
        "error": "Conflict",
        "message": ["El email ya existe"] 
      }
      throw new ConflictException(error) 
    }
    // Encriptar la contraseña
    const hashPassword = await bcrypt.hash(password, numRound)
    createUserDto.password = hashPassword; 

    const savedUser = this.userRepo.save(createUserDto);

    const responseUser = new ResponseUserDto(); 
    
    responseUser.id = (await savedUser).id; 
    responseUser.email = (await savedUser).email; 
    responseUser.name = (await savedUser).name; 

    return responseUser; 
  }

  async login(loginUserDto:LoginUserDto) {
    const {email, password} = loginUserDto; 
    
    // Verificar que el email existe 
    // Comparar contraseñas que sean iguales
    const emailExist = await this.userRepo.findOneBy({email})
    if(!emailExist){
      const error = {
        "statusCode": 404,
        "error": "Not Found",
        "message": ["El usuario no existe"] 
      }

      throw new NotFoundException(error)
    }
    // Comparar las contraseñas 
    const matchPassword = await bcrypt.compare(password, emailExist.password)
    if(!matchPassword) {
      const error = {
        "statusCode": 401,
        "error": "Unauthorized",
        "message": ["Contrasena incorrecta"]
      }

      throw new UnauthorizedException(error)
    }

    // Regresar token
    const payload = {
      sub:emailExist.id, 
      name:emailExist.name,
      email:emailExist.email 
    }

    const token = await this.jwtService.signAsync(payload) 
    const tokenResponse = new TokenResponseDto(token, 600)

    return {tokenResponse}
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}