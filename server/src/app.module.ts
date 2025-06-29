import { Module } from '@nestjs/common';
import { AppController, ApiController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController, ApiController],
})
export class AppModule {}