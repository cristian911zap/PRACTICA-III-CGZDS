import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o email ya registrado' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Ruta no protegida - Todos los usuarios o clientes pueden hacer login
  @Post('/login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Ruta o end point protegido que requiera un token
  // Para ver el perfil de un usuario, se requiere de un token
  // El guard crea el objeto user, y lo anexa a la solicitud
  @UseGuards(AuthGuard)
  @Get('/profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  profile(@Request() req) {
    return "La sesion de " + req.user.name + " esta activa, con correo " + req.user.email
  }
}