import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    /*
     * Inject the AppService into the AppController
     */
    private readonly appService: AppService,
  ) {}
}
