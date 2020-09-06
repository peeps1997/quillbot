import { Controller, Res, Req, Get } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
@Controller()
export class CoreController {

  @Get()
  serveAPP(
    @Res() response: Response,
  ) {
    response.sendFile(join(__dirname, '..', 'client', 'index.html'));
  }
}
