import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ShortcutsModule {}
