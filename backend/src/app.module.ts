import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { StorageModule } from './modules/storage/storage.module';
import { SketchesModule } from './modules/sketch/sketch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    StorageModule,
    SketchesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
