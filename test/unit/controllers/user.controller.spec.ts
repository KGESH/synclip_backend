import { Test } from '@nestjs/testing';
import { UserService } from '../../../src/services/user.service';
import {
  IUser,
  IUserCreate,
  IUserQuery,
  IUserUpdate,
} from '../../../src/dtos/user.dto';
import { MockUserHelper } from '../../helper/random/user.helper';
import { EntityConflictException } from '../../../src/exceptions/entityConflict.exception';
import { EntityNotfoundException } from '../../../src/exceptions/entityNotfound.exception';
import { UserController } from '../../../src/controllers/user.controller';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('[Spec] User Controller', () => {
  let userController: UserController;
  let mockUserService: DeepMockProxy<UserService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockDeep<UserService>())
      .compile();

    userController = moduleRef.get(UserController);
    mockUserService = moduleRef.get(UserService);
  });

  afterEach(() => {
    mockUserService.createUser.mockReset();
    mockUserService.findUser.mockReset();
    mockUserService.updateUser.mockReset();
  });

  describe('[createUser]', () => {
    it(`[success] should be create user`, async () => {
      const createDto: IUserCreate = MockUserHelper.createDto();
      const mockCreatedUserDto: IUser = {
        id: MockUserHelper.randomId(),
        ...createDto,
      };

      mockUserService.createUser.mockResolvedValue(mockCreatedUserDto);

      const createdResponse = await userController.createUser(createDto);

      expect(createdResponse.status).toEqual('success');
      expect(createdResponse.data).toEqual(mockCreatedUserDto);
    });

    it(`[exception] should be throw conflict exception when user already exist`, async () => {
      const createDto: IUserCreate = MockUserHelper.createDto();
      const mockFoundUserDto: IUser = {
        id: MockUserHelper.randomId(),
        ...createDto,
      };

      mockUserService.createUser.mockRejectedValue(
        new EntityConflictException({ message: 'user already exists' }),
      );

      try {
        const willThrowConflictException = await userController.createUser(
          createDto,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityConflictException);
      }
    });
  });

  describe('[getUser]', () => {
    it(`[success] should be find user by id`, async () => {
      const mockFoundUserDto: IUser = MockUserHelper.dto();
      const query: IUserQuery = { id: mockFoundUserDto.id };

      mockUserService.findUser.mockResolvedValue(mockFoundUserDto);

      const foundResponse = await userController.getUser(query);

      expect(foundResponse.status).toEqual('success');
      expect(foundResponse.data).toEqual(mockFoundUserDto);
    });

    it(`[success] should be find user by email`, async () => {
      const mockFoundUserDto: IUser = MockUserHelper.dto();
      const query: IUserQuery = { email: mockFoundUserDto.email };

      mockUserService.findUser.mockResolvedValue(mockFoundUserDto);

      const foundResponse = await userController.getUser(query);

      expect(foundResponse.status).toEqual('success');
      expect(foundResponse.data).toEqual(mockFoundUserDto);
    });

    it(`[exception] should be throw EntityNotfoundException`, async () => {
      const mockUserQuery: IUserQuery = { id: MockUserHelper.randomId() };

      mockUserService.findUser.mockRejectedValue(
        new EntityNotfoundException({ message: 'user not found' }),
      );

      try {
        const willThrowEntityNotfoundException = await userController.getUser(
          mockUserQuery,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotfoundException);
      }
    });
  });

  describe('[updateUser]', () => {
    it(`[success] should be update user`, async () => {
      const updateDto: IUserUpdate = MockUserHelper.updateDto();
      const mockUpdatedUserDto: IUser = {
        ...MockUserHelper.dto(),
        ...updateDto,
      };

      mockUserService.updateUser.mockResolvedValue(mockUpdatedUserDto);

      const updatedResponse = await userController.updateUser(updateDto);

      expect(updatedResponse.status).toEqual('success');
      expect(updatedResponse.data?.nickname).toEqual(updateDto.nickname);
    });

    it(`[exception] should be throw EntityNotfoundException`, async () => {
      const updateDto: IUserUpdate = MockUserHelper.updateDto();

      mockUserService.updateUser.mockRejectedValue(
        new EntityNotfoundException({ message: 'user not found' }),
      );

      try {
        const willThrowEntityNotfoundException =
          await userController.updateUser(updateDto);
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotfoundException);
      }
    });
  });
});
