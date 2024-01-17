import { Test } from '@nestjs/testing';
import { UserService } from '../../../src/services/user.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserRepository } from '../../../src/repositories/user.repository';
import {
  IUser,
  IUserCreate,
  IUserQuery,
  IUserUpdate,
} from '../../../src/dtos/user.dto';
import {
  createRandomCreateUserDto,
  createRandomUpdateUserDto,
  createRandomUserDto,
  createRandomUserId,
} from '../../helper/random/user.helper';
import { EntityConflictException } from '../../../src/exceptions/entityConflict.exception';
import { RequiredArgsException } from '../../../src/exceptions/requiredArgs.exception';
import { EntityNotfoundException } from '../../../src/exceptions/entityNotfound.exception';

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

  afterEach(() => {
    mockUserRepository.findBy.mockReset();
    mockUserRepository.findMany.mockReset();
    mockUserRepository.create.mockReset();
    mockUserRepository.update.mockReset();
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

  describe('[findUser]', () => {
    it(`[success] should be find user by id`, async () => {
      const mockFoundUser: IUser = createRandomUserDto();
      const query: IUserQuery = { id: mockFoundUser.id };

      mockUserRepository.findBy.mockResolvedValue(mockFoundUser);

      const foundUser = await userService.findUser(query);

      expect(foundUser).toStrictEqual(mockFoundUser);
    });

    it(`[success] should be find user by email`, async () => {
      const mockFoundUser: IUser = createRandomUserDto();
      const query: IUserQuery = { email: mockFoundUser.email };

      mockUserRepository.findBy.mockResolvedValue(mockFoundUser);

      const foundUser = await userService.findUser(query);

      expect(foundUser).toStrictEqual(mockFoundUser);
    });

    it(`[success] should be receive null when user not found`, async () => {
      const query: IUserQuery = { id: createRandomUserId() };

      mockUserRepository.findBy.mockResolvedValue(null);

      const foundUser = await userService.findUser(query);

      expect(foundUser).toBeNull();
    });

    it(`[exception] should be throw required args exception when id and email is not provided`, async () => {
      const query: IUserQuery = {};

      try {
        const willThrowRequiredArgsException = await userService.findUser(
          query,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(RequiredArgsException);
      }
    });
  });

  describe('[updateUser]', () => {
    it(`[success] should be update user`, async () => {
      const mockFoundUser: IUser = createRandomUserDto();
      const mockUpdateDto = { ...mockFoundUser, nickname: 'new nickname' };

      mockUserRepository.findBy.mockResolvedValue(mockFoundUser);
      mockUserRepository.update.mockResolvedValue(mockUpdateDto);

      const updatedUser = await userService.updateUser(mockUpdateDto);

      expect(updatedUser).toStrictEqual(mockUpdateDto);
    });

    it(`[exception] should be throw not found exception when user not found`, async () => {
      const mockUpdateDto: IUserUpdate = createRandomUpdateUserDto();

      mockUserRepository.findBy.mockResolvedValue(null);

      try {
        const willThrowNotFoundException = await userService.updateUser(
          mockUpdateDto,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotfoundException);
      }
    });
  });
});
