import { Test, TestingModule } from '@nestjs/testing';
import { BannedUsersService } from './banned-users.service';

describe('BannedUsersService', () => {
  let service: BannedUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BannedUsersService],
    }).compile();

    service = module.get<BannedUsersService>(BannedUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
