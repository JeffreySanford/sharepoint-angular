import { Module } from '@nestjs/common';
import { AppController, ApiController } from './app.controller';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [ReportsModule],
  controllers: [AppController, ApiController],
})
export class AppModule {}