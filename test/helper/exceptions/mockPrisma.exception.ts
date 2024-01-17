import { Prisma } from '@prisma/client';
import {
  PRISMA_ENTITY_NOT_FOUND,
  PRISMA_UNIQUE_CONSTRAINT_FAILED,
} from '../../../src/constants/prisma.constant';

export const mockPrismaEntityNotfoundError = (message: string) => {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code: PRISMA_ENTITY_NOT_FOUND,
    clientVersion: '',
  });
};

export const mockPrismaUniqueConstraintError = (message: string) => {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code: PRISMA_UNIQUE_CONSTRAINT_FAILED,
    clientVersion: '',
  });
};
