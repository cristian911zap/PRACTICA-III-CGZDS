// movimientos.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException, 
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private movimientoRepository: Repository<Movimiento>,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto, emisorId: number): Promise<Movimiento> {
    const nuevoMovimiento = this.movimientoRepository.create({
      ...createMovimientoDto,
      emisor: emisorId,
    });
    
    return await this.movimientoRepository.save(nuevoMovimiento);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    tipo?: string,
  ): Promise<{ data: Movimiento[]; total: number; page: number; totalPages: number }> {
    const query = this.movimientoRepository.createQueryBuilder('movimiento');
    
    if (tipo) {
      query.andWhere('movimiento.tipo = :tipo', { tipo });
    }
    
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Movimiento> {
    const movimiento = await this.movimientoRepository.findOne({ where: { id } });
    
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    
    return movimiento;
  }

  async update(
    id: string, 
    updateMovimientoDto: UpdateMovimientoDto, 
    emisorId: number
  ): Promise<Movimiento> {
    const movimiento = await this.findOne(id);
    
    // Verificar propiedad
    if (movimiento.emisor !== emisorId) {
      throw new ForbiddenException('No tienes permiso para modificar este movimiento');
    }
    
    // Actualizar campos
    movimiento.suma = updateMovimientoDto.suma ?? movimiento.suma;
    movimiento.banco = updateMovimientoDto.banco ?? movimiento.banco;
    movimiento.tipo = updateMovimientoDto.tipo ?? movimiento.tipo;
    
    const resultado = await this.movimientoRepository.save(movimiento);

    return resultado; 
  }

  async remove(id: string, emisorId: number): Promise<void> {
    const movimiento = await this.findOne(id);
    
    if (movimiento.emisor !== emisorId) {
      throw new ForbiddenException('No tienes permiso para eliminar este movimiento');
    }
    
    const result = await this.movimientoRepository.delete(id);
    
    if (result.affected === 0) {
      throw new BadRequestException(`No se pudo eliminar el movimiento ${id}`);
    }
  }

  async findByTipo(tipo: string, emisorId?: number): Promise<Movimiento[]> {
    const query = this.movimientoRepository.createQueryBuilder('movimiento')
      .where('movimiento.tipo = :tipo', { tipo });
    
    if (emisorId) {
      query.andWhere('movimiento.emisor = :emisorId', { emisorId });
    }
    
    return await query.getMany();
  }
}