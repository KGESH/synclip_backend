import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SynclipExceptionFilter } from './filters/synclipException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new SynclipExceptionFilter());

  await app.listen(3000);
}
bootstrap();
