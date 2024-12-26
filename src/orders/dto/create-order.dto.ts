import { OrderStatus } from '@prisma/client';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { CreateItemOrderDto } from './create-item-order.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemOrderDto)
  items: CreateItemOrderDto[];
 
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
}
