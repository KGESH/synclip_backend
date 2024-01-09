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

    if (!query.userId && !query.email) {
      return {
        status: 'error',
        message: 'userId or email is required',
      };
    }

    try {
      const user = await this.userService.findUser({
        id: query.userId,
        email: query.email,
      });

      if (!user) {
        return {
          status: 'error',
          message: 'user not found',
        };
      }

      const drive = await this.driveService.findDrive({
        userId: user.id,
      });

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
  async registerDrive(
    @TypedBody() dto: IDriveCreate,
  ): Promise<IResponse<IDrive>> {
    this.logger.log(`[registerDrive] DTO: `, dto);

    const user = this.userService.findUser({ id: dto.userId });

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
