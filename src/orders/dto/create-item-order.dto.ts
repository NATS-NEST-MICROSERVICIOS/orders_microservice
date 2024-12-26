//import { OrderStatus } from '@prisma/client';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateItemOrderDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

/* @IsPositive()
  @IsNumber()
  totalAmount: number;

  @IsPositive()
  @IsNumber()
  totalItems: number;

  @IsEnum(OrderStatusList, {
    message: `Invalid status ${OrderStatusList}`,
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;

  @IsOptional()
  @IsBoolean()
  paid: boolean = false; */
