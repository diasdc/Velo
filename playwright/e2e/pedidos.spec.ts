import { test } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'
import { Navbar } from '../support/components/Navbar'
import { HomePage } from '../support/pages/HomePage'
import { OrderLookupPage, type OrderDetails } from '../support/pages/OrderLookupPage'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.expectHeroVisible()

    const navbar = new Navbar(page)
    await navbar.orderLookupLink()

    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.expectPageLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-MI0HWS',
      status: 'APROVADO',
      color: 'Midnight Black',
      wheels: 'aero Wheels',
      customer: {
        name: 'Thiago Costa',
        email: 'diasdc@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act
    const orderLockupPage = new OrderLookupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-706PUN',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Miguel Costa',
        email: 'costa@test.com'
      },
      payment: 'À Vista'
    }

    // Act
    const orderLockupPage = new OrderLookupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-Z7GRYO',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Ivan Costa',
        email: 'ivancosta@teste.com'
      },
      payment: 'À Vista'
    }

    // Act
    const orderLockupPage = new OrderLookupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order)

    await orderLookupPage.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ page }) => {

    const codigoForaDoPadrao = 'XXX-999'

    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(codigoForaDoPadrao)

    await orderLookupPage.validateOrderNotFound()
  })
})