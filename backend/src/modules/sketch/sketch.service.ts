import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSketchDto } from './dto/create-sketch.dto';
import { StorageService } from '../storage/storage.service';
import { Sketch } from 'src/entities/sketch.entity';

@Injectable()
export class SketchesService {
  private readonly logger = new Logger(SketchesService.name);

  constructor(
    @InjectRepository(Sketch)
    private sketchRepository: Repository<Sketch>,
    private storageService: StorageService,
  ) {}

  async create(createSketchDto: CreateSketchDto): Promise<Sketch> {
    try {
      const imageFileName = this.storageService.generateFileName('sketch', 'png');
      const thumbnailFileName = this.storageService.generateFileName('thumb', 'jpg');

      this.logger.log('Uploading full image...');
      const imageUrl = await this.storageService.uploadImage(
        imageFileName,
        createSketchDto.imageData,
        'full',
      );

      this.logger.log('Uploading thumbnail...');
      const thumbnailUrl = await this.storageService.uploadImage(
        thumbnailFileName,
        createSketchDto.thumbnail,
        'thumbnails',
      );

      const sketch = this.sketchRepository.create({
        title: createSketchDto.title,
        imageUrl,
        thumbnailUrl,
      });

      const savedSketch = await this.sketchRepository.save(sketch);
      this.logger.log(`Sketch created with ID: ${savedSketch.id}`);

      return savedSketch;
    } catch (error) {
      this.logger.error('Failed to create sketch:', error);
      throw error;
    }
  }

  async findAll(): Promise<Sketch[]> {
    return await this.sketchRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Sketch> {
    const sketch = await this.sketchRepository.findOne({ where: { id } });
    if (!sketch) {
      throw new NotFoundException(`Sketch with ID ${id} not found`);
    }
    return sketch;
  }

  async remove(id: number): Promise<void> {
    try {
      const sketch = await this.findOne(id);

      await this.storageService.deleteImages([
        sketch.imageUrl,
        sketch.thumbnailUrl,
      ]);

      await this.sketchRepository.delete(id);
      this.logger.log(`Sketch ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete sketch ${id}:`, error);
      throw error;
    }
  }
}