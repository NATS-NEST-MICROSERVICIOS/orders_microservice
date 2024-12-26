import { PrismaClient, OrderStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Cantidad de órdenes a generar
  const NUM_ORDERS = 50;

  // Crear órdenes aleatorias
  const orders = [];
  for (let i = 0; i < NUM_ORDERS; i++) {
    const paid = faker.datatype.boolean();
    const paidAt = paid ? faker.date.recent() : null;

    // Generar el precio en un rango entre 10 y 500
    const totalAmount = parseFloat(
      (Math.random() * (500 - 10) + 10).toFixed(2),
    );

    orders.push({
      totalAmount: totalAmount, // Precio aleatorio entre 10 y 500
      totalItems: faker.number.int({ min: 1, max: 10 }), // Número aleatorio de artículos entre 1 y 10
      status: faker.helpers.arrayElement(Object.values(OrderStatus)), // Estado aleatorio de la orden
      paid: paid,
      paidAT: paidAt, // Fecha de pago si está pagado
      createdAt: faker.date.recent(), // Fecha de creación aleatoria
      updatedAt: faker.date.recent(), // Fecha de actualización aleatoria
    });
  }

  // Crear órdenes en la base de datos
  await prisma.order.createMany({
    data: orders,
  });

  console.log(`${NUM_ORDERS} órdenes creadas.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
