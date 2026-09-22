import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('my-orders')
findMyOrders(@Session() session: UserSession) {
    return this.ordersService.findMyOrders(session.user.id);
}

  @Patch(':id/status') 
  updateStatus(@Param('id') id: string , @Body() body:{status:string} , @Session() session:UserSession) {
    return this.ordersService.updateStatus(+id , body.status , session.user.email)

  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Session() session: UserSession) {
    return this.ordersService.create(createOrderDto, session.user.id);
  }

  @Get('all')
  findAll(@Session() session: UserSession) {
    return this.ordersService.findAll(session.user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancelOrder(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  

}
