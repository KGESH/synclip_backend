import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserRepository } from '../../../src/repositories/user.repository';
import {
  IUserCreate,
  IUserQuery,
  IUserUpdate,
} from '../../../src/dtos/user.dto';
import {
  createRandomCreateUserDto,
  createRandomUserEntity,
  createRandomUserId,
} from '../../helper/random/user.helper';
import { EntityConflictException } from '../../../src/exceptions/entityConflict.exception';
import { EntityNotfoundException } from '../../../src/exceptions/entityNotfound.exception';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from '../../../src/services/prisma.service';
import {
  mockPrismaEntityNotfoundError,
  mockPrismaUniqueConstraintError,
} from '../../helper/exceptions/mockPrisma.exception';

describe('[Spec] User Repository', () => {
  let userRepository: UserRepository;
  let mockPrismaClient: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    mockPrismaClient = moduleRef.get(PrismaService);
  });

  afterEach(() => {
    mockPrismaClient.user.findUniqueOrThrow.mockReset();
    mockPrismaClient.user.create.mockReset();
    mockPrismaClient.user.update.mockReset();
  });

  describe('[findBy]', () => {
    it('[success] should be find user by id', async () => {
      const mockUser: User = createRandomUserEntity();
      const mockUserQuery: IUserQuery = { id: mockUser.id };

      mockPrismaClient.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const foundUser = await userRepository.findBy(mockUserQuery);

      expect(foundUser?.id).toStrictEqual(mockUser.id);
    });

    it('[success] should be find user by email', async () => {
      const mockUser: User = createRandomUserEntity();
      const mockUserQuery: IUserQuery = { email: mockUser.email };

      mockPrismaClient.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const foundUser = await userRepository.findBy(mockUserQuery);

      expect(foundUser?.email).toStrictEqual(mockUser.email);
    });

    it('[exception] should be throw EntityNotfoundException', async () => {
      const mockUserQuery: IUserQuery = { id: createRandomUserId() };

      mockPrismaClient.user.findUniqueOrThrow.mockRejectedValue(
        mockPrismaEntityNotfoundError(`User not found.`),
      );

      try {
        const willThrowEntityNotfoundException = await userRepository.findBy(
          mockUserQuery,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotfoundException);
      }
    });
  });

  describe('[create]', () => {
    it('[success] should be create user', async () => {
      const createDto: IUserCreate = createRandomCreateUserDto();
      const mockCreatedUser: User = {
        ...createRandomUserEntity(),
        ...createDto,
      };

      mockPrismaClient.user.create.mockResolvedValue(mockCreatedUser);

      const createdUser = await userRepository.create(createDto);

      expect(createdUser.email).toStrictEqual(mockCreatedUser.email);
    });

    it('[exception] should be throw EntityConflictException', async () => {
      const createDto: IUserCreate = createRandomCreateUserDto();
      const mockCreatedUser: User = {
        ...createRandomUserEntity(),
        ...createDto,
      };

      mockPrismaClient.user.create.mockRejectedValue(
        mockPrismaUniqueConstraintError(
          `Unique constraint failed on the constraint: 'email'`,
        ),
      );

      try {
        const willThrowEntityConflictException = await userRepository.create(
          createDto,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityConflictException);
      }
    });
  });

  describe('[update]', () => {
    it('[success] should be update user', async () => {
      const mockUser: User = {
        ...createRandomUserEntity(),
        nickname: 'before',
      };
      const updateDto: IUserUpdate = {
        id: mockUser.id,
        nickname: 'after',
      };
      const mockUpdatedUser: User = {
        ...mockUser,
        nickname: 'after',
      };

      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser);

      const updatedUser = await userRepository.update(updateDto);

      expect(updatedUser?.nickname).toStrictEqual(mockUpdatedUser.nickname);
      expect(updatedUser?.nickname).not.toStrictEqual(mockUser.nickname);
    });
  });
});
