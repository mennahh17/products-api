import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

const OWNER_EMAIL = 'admin@test1.com';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

create(createProductDto: CreateProductDto, userEmail: string) {
    if (userEmail !== OWNER_EMAIL) {
      throw new ForbiddenException('Only the site owner can add products directly');
    }
    return this.prisma.product.create({
      data: { ...createProductDto, status: 'approved' },
    });
}

  createSellRequest(createProductDto: CreateProductDto, userId: string) {
    return this.prisma.product.create({
      data: { ...createProductDto, status: 'pending', submittedBy: userId },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      where: { status: 'approved' },
    });
  }

  findPending(userEmail: string) {
    if (userEmail !== OWNER_EMAIL) {
      throw new ForbiddenException('Only the site owner can view pending requests');
    }
    return this.prisma.product.findMany({
      where: { status: 'pending' },
    });
  }

  approve(id: number, userEmail: string) {
    if (userEmail !== OWNER_EMAIL) {
      throw new ForbiddenException('Only the site owner can approve requests');
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: 'approved' },
    });
  }

  reject(id: number, userEmail: string) {
    if (userEmail !== OWNER_EMAIL) {
      throw new ForbiddenException('Only the site owner can reject requests');
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}