import { Module } from '@nestjs/common';
import { AppController, ApiController } from './app.controller';
import { ReportsModule } from './reports/reports.module';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [ReportsModule, ListsModule],
  controllers: [AppController, ApiController],
})
export class AppModule {}