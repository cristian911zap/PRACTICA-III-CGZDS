// preguntas.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException, 
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';

@Injectable()
export class PreguntasService {
  constructor(
    @InjectRepository(Pregunta)
    private preguntaRepository: Repository<Pregunta>,
  ) {}

  async create(createPreguntaDto: CreatePreguntaDto, usuarioId: number): Promise<Pregunta> {
    // Validaciones adicionales
    if (createPreguntaDto.tipoPregunta === "numerica" && createPreguntaDto.respuesta) {
      // Verificar que la respuesta numérica sea válida
      const numero = Number(createPreguntaDto.respuesta);
      if (isNaN(numero)) {
        throw new BadRequestException('Para preguntas numéricas, la respuesta debe ser un número');
      }
    }

    const nuevaPregunta = this.preguntaRepository.create({
      ...createPreguntaDto,
      usuarioId,
    });
    
    return await this.preguntaRepository.save(nuevaPregunta);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    tipoPregunta?: string,
  ): Promise<{ data: Pregunta[]; total: number; page: number; totalPages: number }> {
    const query = this.preguntaRepository.createQueryBuilder('pregunta');
    
    if (tipoPregunta) {
      query.andWhere('pregunta.tipoPregunta = :tipoPregunta', { tipoPregunta });
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

  async findOne(id: string): Promise<Pregunta> {
    const pregunta = await this.preguntaRepository.findOne({ where: { id } });
    
    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }
    
    return pregunta;
  }

  async update(
    id: string, 
    updatePreguntaDto: UpdatePreguntaDto, 
    usuarioId: number
  ): Promise<Pregunta> {
    const pregunta = await this.findOne(id);
    
    // Verificar propiedad
    if (pregunta.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para modificar esta pregunta');
    }
    
    // Validar respuesta numérica si se actualiza
    if (updatePreguntaDto.tipoPregunta === "numerica" && updatePreguntaDto.respuesta) {
      const numero = Number(updatePreguntaDto.respuesta);
      if (isNaN(numero)) {
        throw new BadRequestException('Para preguntas numéricas, la respuesta debe ser un número');
      }
    }
    
    // Actualizar campos
    pregunta.tipoPregunta = updatePreguntaDto.tipoPregunta ?? pregunta.tipoPregunta;
    pregunta.pregunta = updatePreguntaDto.pregunta ?? pregunta.pregunta;
    pregunta.respuesta = updatePreguntaDto.respuesta ?? pregunta.respuesta;
    pregunta.valor = updatePreguntaDto.valor ?? pregunta.valor;
    
    const resultado = await this.preguntaRepository.save(pregunta);

    return resultado; 
  }

  async remove(id: string, usuarioId: number): Promise<void> {
    const pregunta = await this.findOne(id);
    
    if (pregunta.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta pregunta');
    }
    
    const result = await this.preguntaRepository.delete(id);
    
    if (result.affected === 0) {
      throw new BadRequestException(`No se pudo eliminar la pregunta ${id}`);
    }
  }

  async findByTipo(tipo: string, usuarioId?: string): Promise<Pregunta[]> {
    const query = this.preguntaRepository.createQueryBuilder('pregunta')
      .where('pregunta.tipoPregunta = :tipo', { tipo });
    
    if (usuarioId) {
      query.andWhere('pregunta.usuarioId = :usuarioId', { usuarioId });
    }
    
    return await query.getMany();
  }
}
