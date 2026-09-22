import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

const OWNER_EMAIL = 'admin@test1.com' ;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto, userId: string) {
    const totalPrice = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: createOrderDto.items,
        },
        deliveryAddress:createOrderDto.deliveryAddress,
        phone:createOrderDto.phone,
        email:createOrderDto.email,
        country:createOrderDto.country,
        firstName:createOrderDto.firstName,
        lastName:createOrderDto.lastName,
        city:createOrderDto.city,
        governorate:createOrderDto.governorate,
      },
      include: {
        items: true,
      },

    });
  }

  findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  cancelOrder(id: number) {
    return this.prisma.order.update({
        where: { id },
        data: { status: 'cancelled' },
    });
}

  updateStatus (id : number , status : string  , userEmail: string) {
      if (userEmail!==OWNER_EMAIL){
      throw new ForbiddenException('only the site woner can approve orders')
    }
    return this.prisma.order.update ({
      where :{ id },
      data : {status : status},
    });
  }

  findAll (userEmail : string ){
    if (userEmail!==OWNER_EMAIL){
      throw new ForbiddenException('only the site woner can approve orders')
    }
    return this.prisma.order.findMany({
      include :{items:true},
      orderBy : {createdAt : 'desc'}
    });

  } 

}