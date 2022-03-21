import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoriesDto } from './dtos/create-category.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdiminBack: ClientProxy;

  constructor() {
    this.clientAdiminBack = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:J2sfLuu2vwVT@54.144.133.210:5672/smartRanking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoriesDto) {
    return await this.clientAdiminBack.emit(
      'create-category',
      createCategoryDto,
    );
  }
}
