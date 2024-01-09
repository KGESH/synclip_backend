import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ShortcutsController } from '../controllers/shortcuts.controller';
import { ShortcutsService } from '../services/shortcuts.service';
import { UserModule } from './user.module';
import { ShortcutsRepository } from '../repositories/shortcuts.repository';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [ShortcutsController],
  providers: [ShortcutsService, ShortcutsRepository],
})
export class ShortcutsModule {}
