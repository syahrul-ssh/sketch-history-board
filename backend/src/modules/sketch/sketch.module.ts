import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { Sketch } from 'src/entities/sketch.entity';
import { SketchesService } from './sketch.service';
import { SketchesController } from './sketch.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sketch]),
    StorageModule,
  ],
  controllers: [SketchesController],
  providers: [SketchesService],
})
export class SketchesModule {}