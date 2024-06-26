import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('alive')
  alive(): string {
    return 'alive';
  }
}
