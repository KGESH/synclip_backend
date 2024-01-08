import { Controller, Logger, Patch, Post } from '@nestjs/common';
import { DriveService } from '../services/drive.service';
import { UserService } from '../services/user.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { IDriveCreate, IDriveResponse, IDriveUpdate } from '../dtos/drive.dto';
import { tags } from 'typia';

@Controller('drive')
export class DriveController {
  private readonly logger = new Logger(DriveController.name);

  constructor(
    private readonly userService: UserService,
    private readonly driveService: DriveService,
  ) {}

  @TypedRoute.Get('/:userId')
  async getDrive(
    @TypedParam('userId') userId: string & tags.Format<'uuid'>,
  ): Promise<IDriveResponse> {
    this.logger.log(`[getDrive] userId: `, userId);

    try {
      const user = await this.userService.findUserById({ id: userId });

      if (!user) {
        return {
          status: 'error',
          message: 'user not found',
        };
      }

      const drive = await this.driveService.findDrive({ userId });

      if (!drive) {
        return {
          status: 'not_found',
          message: 'drive not found',
        };
      }

      return {
        status: 'success',
        data: drive,
      };
    } catch (e) {
      return {
        status: 'error',
        message: `Unknown error ${e}`,
      };
    }
  }

  @Post('/')
  async registerDrive(@TypedBody() dto: IDriveCreate) {
    this.logger.log(`[registerDrive] DTO: `, dto);

    const user = this.userService.findUserById({ id: dto.userId });

    if (!user) {
      return {
        status: 'not_found',
        message: 'user not found',
      };
    }

    return await this.driveService.createDrive(dto);
  }

  @Patch('/')
  updateFolderId(@TypedBody() dto: IDriveUpdate) {
    this.logger.log(`[updateFcmToken] DTO: `, dto);
    return this.driveService.updateFolderId(dto);
  }
}
