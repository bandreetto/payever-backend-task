import { Module } from '@nestjs/common';
import { ReqresService } from './reqres.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('REQRES_BASE_URL'),
      }),
    }),
  ],
  providers: [ReqresService],
})
export class ReqresModule {}
