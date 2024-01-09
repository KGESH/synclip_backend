import { Controller, Logger, Patch, Post } from '@nestjs/common';
import { DriveService } from '../services/drive.service';
import { UserService } from '../services/user.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import {
  IDrive,
  IDriveCreate,
  IDriveFoldersQuery,
  IDriveUpdate,
} from '../dtos/drive.dto';
import { IResponse } from '../dtos/response.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('drive')
export class DriveController {
  private readonly logger = new Logger(DriveController.name);

  constructor(
    private readonly userService: UserService,
    private readonly driveService: DriveService,
  ) {}

  @TypedRoute.Get('/')
  async getDrive(
    @TypedQuery() query: IDriveFoldersQuery,
  ): Promise<IResponse<IDrive>> {
    this.logger.debug(`[getDrive] Query: `, query);

    const user = await this.userService.findUser(query);

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    const drive = await this.driveService.findDrive({ userId: user.id });

    if (!drive)
      throw new EntityNotfoundException({ message: 'drive not found' });

    return {
      status: 'success',
      data: drive,
    };
  }

  @Post('/')
  async registerDrive(
    @TypedBody() dto: IDriveCreate,
  ): Promise<IResponse<IDrive>> {
    this.logger.log(`[registerDrive] DTO: `, dto);

    const user = this.userService.findUser({ id: dto.userId });

    if (!user) throw new EntityNotfoundException({ message: 'user not found' });

    const drive = await this.driveService.createDrive(dto);

    return {
      status: 'success',
      data: drive,
    };
  }

  @Patch('/')
  async updateFolderId(
    @TypedBody() dto: IDriveUpdate,
  ): Promise<IResponse<IDrive>> {
    const updated = await this.driveService.updateFolderId(dto);

    return {
      status: 'success',
      data: updated,
    };
  }
}
