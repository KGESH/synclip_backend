import { Test } from '@nestjs/testing';
import { UserService } from '../../../src/services/user.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserRepository } from '../../../src/repositories/user.repository';
import { IUser, IUserCreate } from '../../../src/dtos/user.dto';
import {
  createRandomCreateUserDto,
  createRandomUserId,
} from '../../helper/random/user.helper';
import { EntityConflictException } from '../../../src/exceptions/entityConflict.exception';

describe('[Spec] User Service', () => {
  let userService: UserService;
  let mockUserRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .compile();

    userService = moduleRef.get<UserService>(UserService);
    mockUserRepository = moduleRef.get<
      UserRepository,
      DeepMockProxy<UserRepository>
    >(UserRepository);
  });

  describe('[createUser]', () => {
    it(`[success] should be create user`, async () => {
      const createDto: IUserCreate = createRandomCreateUserDto();
      const mockCreatedUser: IUser = { id: createRandomUserId(), ...createDto };

      mockUserRepository.findBy.mockResolvedValue(null);
      mockUserRepository.create
        .calledWith(createDto)
        .mockResolvedValue(mockCreatedUser);

      const createdUser = await userService.createUser(createDto);

      expect(createdUser).toStrictEqual(mockCreatedUser);
    });

    it('[exception] should be throw conflict exception when user already exist', async () => {
      const createDto: IUserCreate = createRandomCreateUserDto();
      const mockFoundUser: IUser = { id: createRandomUserId(), ...createDto };

      mockUserRepository.findBy.mockResolvedValue(mockFoundUser);

      try {
        const willThrowConflictException = await userService.createUser(
          createDto,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityConflictException);
      }
    });
  });
});
