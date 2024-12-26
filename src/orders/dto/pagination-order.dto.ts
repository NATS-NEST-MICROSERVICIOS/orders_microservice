import { OrderStatus } from '@prisma/client';
import { PaginationDto } from '../../common/pagination.dto';
import { OrderStatusList } from '../enum/order.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Status must be one of ${Object.values(OrderStatusList)}`,
  })
  status: OrderStatus;
}
