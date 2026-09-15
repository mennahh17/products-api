import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

@Post()
create(@Body() createProductDto: CreateProductDto, @Session() session: UserSession) {
    return this.productsService.create(createProductDto, session.user.email);
}

  @Post('sell-request')
  createSellRequest(
    @Body() createProductDto: CreateProductDto,
    @Session() session: UserSession,
  ) {
    return this.productsService.createSellRequest(createProductDto, session.user.id);
  }

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('pending')
  findPending(@Session() session: UserSession) {
    return this.productsService.findPending(session.user.email);
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Session() session: UserSession) {
    return this.productsService.approve(+id, session.user.email);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Session() session: UserSession) {
    return this.productsService.reject(+id, session.user.email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}