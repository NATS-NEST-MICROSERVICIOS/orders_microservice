import { OrderStatus } from '@prisma/client';
const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];
export { OrderStatusList };
