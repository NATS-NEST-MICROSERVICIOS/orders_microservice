import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';

export class UpdateOrderDto {
  //extends PartialType(CreateOrderDto) {
  @IsString()
  id: string;

  @IsEnum(OrderStatusList, {
    message: 'Status is not valid',
  })
  status: OrderStatus;

  @IsBoolean()
  paid: boolean;
}
