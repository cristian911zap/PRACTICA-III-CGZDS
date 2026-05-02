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

@Controller('preguntas')
@UseGuards(AuthGuard)
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService ) {}

  @Get('test')
  test() {
    return { message: 'Ruta de preguntas funcionando' }; 
  }

  // Crear pregunta
  @Post()
  async create(@Body() createPreguntaDto: CreatePreguntaDto, @Req() req: any) {
    console.log('req.user completo:', req.user);
    const usuarioId = req.user.id;
    console.log('usuarioId a guardar:0:', usuarioId); 
    return this.preguntasService.create(createPreguntaDto, usuarioId);
  }

  // Listar todas las preguntas (con filtros)
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('tipoPregunta') tipoPregunta?: string,
  ) {
    return this.preguntasService.findAll(page, limit, tipoPregunta);
  }

  // Obtener pregunta por ID
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.preguntasService.findOne(id);
  }

  // Actualizar pregunta
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePreguntaDto: UpdatePreguntaDto,
    @Req() req: any
  ) {
    const usuarioId = req.user.id;
    return this.preguntasService.update(id, updatePreguntaDto, usuarioId);
  }

  // Eliminar pregunta
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.preguntasService.remove(id, usuarioId);
  }

  // Obtener preguntas por tipo
  @Get('tipo/:tipo')
  async findByTipo(@Param('tipo') tipo: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.preguntasService.findByTipo(tipo, usuarioId);
  }
}
