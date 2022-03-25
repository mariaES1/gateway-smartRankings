import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
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
  createCategory(@Body() createCategoryDto: CreateCategoriesDto) {
    this.clientAdiminBack.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  queryCategories(@Query('categoryId') _id: string) {
    return this.clientAdiminBack.send('query-categories', _id ? _id : '');
  }
}
