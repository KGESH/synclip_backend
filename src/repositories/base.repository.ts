import { Prisma } from '@prisma/client';
import {
  PRISMA_ENTITY_NOT_FOUND,
  PRISMA_UNIQUE_CONSTRAINT_FAILED,
} from '../constants/prisma.constant';
import { UnknownException } from '../exceptions/unknown.exception';
import { EntityConflictException } from '../exceptions/entityConflict.exception';

export abstract class BaseRepository<Entity, DTO> {
  protected abstract _transform(entity: Entity): DTO;

  protected _handlePrismaError(e: Error | unknown, message?: string): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case PRISMA_UNIQUE_CONSTRAINT_FAILED:
          throw new EntityConflictException({
            message: message ?? `Entity already exists.`,
          });

        // Todo: Add more cases

        default:
          throw new UnknownException(e);
      }
    }

    throw new UnknownException(e);
  }

  protected _handlePrismaNotFoundError(
    e: Error | unknown,
    message?: string,
  ): null {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === PRISMA_ENTITY_NOT_FOUND) return null;
    }

    this._handlePrismaError(e, message);
  }
}
