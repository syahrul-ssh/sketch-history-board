import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const DatabaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: configService.get<string>('DB_URI'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
