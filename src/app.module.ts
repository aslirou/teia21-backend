import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'contact',
        ttl: 60000, // 1 minuto em milissegundos
        limit: 3, // 3 requisições por minuto por IP
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get('DATABASE_URL');

        // Se DATABASE_URL existe (Railway interno), usa ela
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [Contact],
            synchronize: !isProduction,
            logging: !isProduction,
            ssl: { rejectUnauthorized: false },
          };
        }

        // Senão, usa variáveis individuais (desenvolvimento local ou externo)
        const isRemoteDb = configService.get('DB_HOST', 'localhost') !== 'localhost';

        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'teia21'),
          entities: [Contact],
          synchronize: !isProduction,
          logging: !isProduction,
          ssl: isRemoteDb ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
