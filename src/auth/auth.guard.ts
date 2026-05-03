import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express'; 

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {

  }

  async canActivate(context: ExecutionContext,): Promise<boolean> {
    // Obtener la solicitud del cliente
    const request = context.switchToHttp().getRequest()
    // Obtener el token
    const token = this.extractTokenFromHeader(request)
    
    // Verificar que haya token
    if(!token){
      throw new UnauthorizedException('Falta el token requerido') 
    }
    
    // Verificar que sea un token valido
    try{
      // Payload = Carga útil 
      const payload = await this.jwtService.verifyAsync(token) 
      // Agregamos a nuestra solicitud el usuario que verificamos
      request['user'] = {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
        ...payload 
      }; 
    } catch {
      throw new UnauthorizedException('Token expirado o invalido')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined { 
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    //Si existe la palabra Bearer regresa el token, de lo contrario regresa undefined
    return type == 'Bearer' ? token : undefined; 
  }
}