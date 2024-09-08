import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'config/configuration.app';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION'),
      }),
    }),
    EventModule,
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV}.env`,
      load: [config],
      isGlobal: true
    }
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }