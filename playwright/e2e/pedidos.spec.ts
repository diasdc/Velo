import { test, expect } from '../support/fixtures';
import { generateOrderCode } from '../support/helpers';
import type { OrderDetails } from '../support/actions/orderLookupActions';

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    // Arrange
    await app.orderLookup.open();
  });

  test('deve consultar um pedido aprovado', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-MI0HWS',
      status: 'APROVADO',
      color: 'Midnight Black',
      wheels: 'aero Wheels',
      customer: {
        name: 'Thiago Costa',
        email: 'diasdc@gmail.com',
      },
      payment: 'À Vista',
    };

    await app.orderLookup.searchOrder(order.number);

    await app.orderLookup.validateOrderDetails(order);
    await app.orderLookup.validateStatusBadge(order.status);
  });

  test('deve consultar um pedido reprovado', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-706PUN',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Miguel Costa',
        email: 'costa@test.com',
      },
      payment: 'À Vista',
    };

    await app.orderLookup.searchOrder(order.number);

    await app.orderLookup.validateOrderDetails(order);
    await app.orderLookup.validateStatusBadge(order.status);
  });

  test('deve consultar um pedido em analise', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-Z7GRYO',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Ivan Costa',
        email: 'ivancosta@teste.com',
      },
      payment: 'À Vista',
    };

    await app.orderLookup.searchOrder(order.number);

    await app.orderLookup.validateOrderDetails(order);
    await app.orderLookup.validateStatusBadge(order.status);
  });

  test('deve exibir mensagem quando o pedido não é encontrado', async ({
    app,
  }) => {
    const order = generateOrderCode();

    await app.orderLookup.searchOrder(order);

    await app.orderLookup.validateOrderNotFound();
  });

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({
    app,
  }) => {
    const codigoForaDoPadrao = 'XXX-999';

    await app.orderLookup.searchOrder(codigoForaDoPadrao);

    await app.orderLookup.validateOrderNotFound();
  });
});
