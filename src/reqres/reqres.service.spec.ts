import { Test, TestingModule } from '@nestjs/testing';
import { ReqresService } from './reqres.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('ReqresService', () => {
  let service: ReqresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.test.env',
        }),
        HttpModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get('REQRES_BASE_URL'),
          }),
        }),
      ],
      providers: [ReqresService],
    }).compile();

    service = module.get<ReqresService>(ReqresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // there is a bug with jest + axios causing circular json
  it.skip('should fetch a user from reqres', async () => {
    const user = await service.getUserById('1');
    expect(user.id).toBe('1');
  });
});
