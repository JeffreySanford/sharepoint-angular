import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

const startTime = Date.now();

@Controller()
export class AppController {
  @Get()
  getWorkbench(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', '..', 'dev-workbench.html'));
  }

  @Get('workbench')
  getWorkbenchAlt(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', '..', 'dev-workbench.html'));
  }
}

@Controller('api')
export class ApiController {
  @Get('uptime')
  getUptime() {
    return { uptime: Math.floor((Date.now() - startTime) / 1000) };
  }

  @Get('time')
  getTime() {
    return { time: new Date().toISOString() };
  }
}