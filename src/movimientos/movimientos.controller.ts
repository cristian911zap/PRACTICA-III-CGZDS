// movimientos.controller.ts
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
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { MovimientosService } from './movimientos.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Movimiento } from './entities/movimiento.entity';

@Controller('movimientos')
@UseGuards(AuthGuard)
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService ) {}

  // Crear movimiento
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear un nuevo movimiento bancario' })
  @ApiResponse({ status: 201, description: 'Movimiento creado exitosamente', type: Movimiento })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido o faltante' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createMovimientoDto: CreateMovimientoDto, @Req() req: any) {
    const emisorId = req.user.id;
    return this.movimientosService.create(createMovimientoDto, emisorId);
  }

  // Listar todos los movimientos
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener todos los movimientos (con paginación y filtros)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Elementos por página' })
  @ApiQuery({ name: 'tipo', required: false, description: 'Filtrar por tipo (transferencia/abono)' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('tipo') tipo?: string,
  ) {
    return this.movimientosService.findAll(page, limit, tipo);
  }

  // Obtener movimiento por ID
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  @ApiParam({ name: 'id', description: 'UUID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento encontrado', type: Movimiento })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.movimientosService.findOne(id);
  }

  // Actualizar movimiento
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar un movimiento (solo el dueño)' })
  @ApiParam({ name: 'id', description: 'UUID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento actualizado exitosamente', type: Movimiento })
  @ApiResponse({ status: 403, description: 'No tienes permiso para modificar este movimiento' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateMovimientoDto: UpdateMovimientoDto,
    @Req() req: any
  ) {
    const emisorId = req.user.id;
    return this.movimientosService.update(id, updateMovimientoDto, emisorId);
  }

  // Eliminar movimiento
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar un movimiento (solo el dueño)' })
  @ApiParam({ name: 'id', description: 'UUID del movimiento' })
  @ApiResponse({ status: 204, description: 'Movimiento eliminado exitosamente' })
  @ApiResponse({ status: 403, description: 'No tienes permiso para eliminar este movimiento' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const emisorId = req.user.id;
    return this.movimientosService.remove(id, emisorId);
  }

  // Obtener movimientos por tipo
  @Get('tipo/:tipo')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener movimientos por tipo (solo del usuario autenticado)' })
  @ApiParam({ name: 'tipo', description: 'Tipo de movimiento (transferencia/abono)' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos filtrados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findByTipo(@Param('tipo') tipo: string, @Req() req: any) {
    const emisorId = req.user.id;
    return this.movimientosService.findByTipo(tipo, emisorId);
  }
}