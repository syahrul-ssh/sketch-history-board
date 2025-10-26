import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateSketchDto } from './dto/create-sketch.dto';
import { SketchesService } from './sketch.service';
import { Sketch } from 'src/entities/sketch.entity';

@Controller('sketches')
export class SketchesController {
  constructor(private readonly sketchesService: SketchesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSketchDto: CreateSketchDto): Promise<Sketch> {
    return await this.sketchesService.create(createSketchDto);
  }

  @Get()
  async findAll(): Promise<Sketch[]> {
    return await this.sketchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sketch> {
    return await this.sketchesService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.sketchesService.remove(+id);
  }
}