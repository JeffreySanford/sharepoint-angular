import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController, ApiController } from './app.controller';
import { ReportsModule } from './reports/reports.module';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 1 minute
        limit: 1000, // max requests per IP
      },
    ]),
    ReportsModule,
    ListsModule,
  ],
  controllers: [AppController, ApiController],
})
export class AppModule {}