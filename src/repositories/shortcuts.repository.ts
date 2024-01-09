import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ShortcutsRepository {
  private readonly logger = new Logger(ShortcutsRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: any) {}
}
