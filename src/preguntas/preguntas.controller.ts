// preguntas.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Req, 
  HttpCode, 
  HttpStatus,
  ParseUUIDPipe,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';
import { PreguntasService } from './preguntas.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Pregunta } from './entities/pregunta.entity';

@Controller('preguntas')
@UseGuards(AuthGuard)
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService ) {}
  // Crear pregunta
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear una nueva pregunta' })
  @ApiResponse({ status: 201, description: 'Pregunta creada exitosamente', type: Pregunta })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido o faltante' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createPreguntaDto: CreatePreguntaDto, @Req() req: any) {
    console.log('req.user completo:', req.user);
    const usuarioId = req.user.id;
    console.log('usuarioId a guardar:0:', usuarioId); 
    return this.preguntasService.create(createPreguntaDto, usuarioId);
  }

  // Listar todas las preguntas (con filtros)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener todas las preguntas (con paginación y filtros)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Elementos por página' })
  @ApiQuery({ name: 'tipoPregunta', required: false, description: 'Filtrar por tipo' })
  @ApiResponse({ status: 200, description: 'Lista de preguntas obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('tipoPregunta') tipoPregunta?: string,
  ) {
    return this.preguntasService.findAll(page, limit, tipoPregunta);
  }

  // Obtener pregunta por ID
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener una pregunta por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la pregunta', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Pregunta encontrada', type: Pregunta })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.preguntasService.findOne(id);
  }

  // Actualizar pregunta
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar una pregunta (solo el dueño)' })
  @ApiParam({ name: 'id', description: 'UUID de la pregunta' })
  @ApiResponse({ status: 200, description: 'Pregunta actualizada exitosamente', type: Pregunta })
  @ApiResponse({ status: 403, description: 'No tienes permiso para modificar esta pregunta' })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updatePreguntaDto: UpdatePreguntaDto,
    @Req() req: any
  ) {
    const usuarioId = req.user.id;
    const resultado = this.preguntasService.update(id, updatePreguntaDto, usuarioId);
    
    return resultado; 
  }

  // Eliminar pregunta
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una pregunta (solo el dueño)' })
  @ApiParam({ name: 'id', description: 'UUID de la pregunta' })
  @ApiResponse({ status: 204, description: 'Pregunta eliminada exitosamente' })
  @ApiResponse({ status: 403, description: 'No tienes permiso para eliminar esta pregunta' })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.preguntasService.remove(id, usuarioId);
  }

  // Obtener preguntas por tipo
  @Get('tipo/:tipo')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener preguntas por tipo (solo del usuario autenticado)' })
  @ApiParam({ name: 'tipo', description: 'Tipo de pregunta' })
  @ApiResponse({ status: 200, description: 'Lista de preguntas filtradas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findByTipo(@Param('tipo') tipo: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.preguntasService.findByTipo(tipo, usuarioId);
  }
}
