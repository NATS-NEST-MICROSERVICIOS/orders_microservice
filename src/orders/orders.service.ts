import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/pagination-order.dto';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  ////logger
  private readonly logger = new Logger();
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to da tabase');
  }

  async create(createOrderDto: CreateOrderDto) {
    ///return this.order.create({ data: createOrderDto });
    try {
      const productIds = createOrderDto.items.map((item) => item.productId);
      console.log(`Product IDs: ${productIds}`);
      // Obtener los productos desde el cliente
      const products: any[] = await firstValueFrom(
        this.client.send({ cmd: 'search_product' }, productIds),
      );

      // Calcular el monto total
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const product = products.find(
          (product) => product.id === orderItem.productId,
        );
        if (!product) {
          throw new Error(
            `Producto con ID ${orderItem.productId} no encontrado.`,
          );
        }
        return acc + product.price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        const product = products.find(
          (product) => product.id === orderItem.productId,
        );
        if (!product) {
          throw new Error(
            `Producto con ID ${orderItem.productId} no encontrado.`,
          );
        }
        return acc + orderItem.quantity;
      }, 0);

      console.log(`Total Amount: ${totalAmount}`);
      // Aquí puedes guardar la orden en la base de datos
      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          orderItems: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          orderItems: {
            select: {
              price: true,
              productId: true,
              quantity: true,
            },
          },
        },
      });
      return {
        ...order,
        orderItems: order.orderItems.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Error in creating order',
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    console.log(orderPaginationDto);

    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });
    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;
    const offset = (currentPage - 1) * perPage;

    return {
      data: await this.order.findMany({
        skip: offset,
        take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        page: currentPage,
        totalPages,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: number) {
    const order = await this.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Order not found  ',
      });
    }

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
    // Obtener los productos desde el cliente
    const products: any[] = await firstValueFrom(
      this.client.send({ cmd: 'search_product' }, productIds),
    );

    return {
      ...order,
      orderItems: order.orderItems.map((orderItem) => ({
        ...orderItem,
        product: products.find((product) => product.id === orderItem.productId)
          .name,
      })),
    };
  }

  async changeStatus(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Order not found  ',
      });
    }
    return await this.order.update({
      where: { id },
      data: { status: updateOrderDto.status },
    });
  }
}
