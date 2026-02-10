import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
import { OrderLookupPage } from '../support/pages/OrderLookupPage'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', ()=>{

  test.beforeEach(async ({page}) => { // beforeEach: roda antes de cada teste
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    // const order = 'VLO-19H18S'
    const order = {
      number: 'VLO-19H18S',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Costa Thiago',
        email: 'thiago.costa@velo.dev',
      },
      payment: 'À Vista'
    }
  
    // Act

    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number)
  
    // Assert
    // const containerPedido = page.getByRole('paragraph')
    //   .filter({ hasText: /^Pedido$/ }) // Filtra a busca por um elemento do tipo parágrafo com o nome exato Pedido (começar com ^ e terminar com $ diz que é para buscar o termo exato)
    //   .locator('..') // Sobe para o elemento pai da div que agrupa os elementos
  // 
    // await expect(containerPedido).toContainText(order, { timeout: 10000 })
  // 
    // await expect(page.getByText('APROVADO')).toBeVisible()

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({ hasText: order.status })

      await expect(statusBadge).toHaveClass(/bg-green-100/)
      await expect(statusBadge).toHaveClass(/text-green-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    // const order = 'VLO-706PUN'
    const order = {
      number: 'VLO-706PUN',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Miguel Costa',
        email: 'costa@test.com',
      },
      payment: 'À Vista'
    }
  
    // Act
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number)
  
    // Assert
    // const containerPedido = page.getByRole('paragraph')
    //   .filter({ hasText: /^Pedido$/ }) // Filtra a busca por um elemento do tipo parágrafo com o nome exato Pedido (começar com ^ e terminar com $ diz que é para buscar o termo exato)
    //   .locator('..') // Sobe para o elemento pai da div que agrupa os elementos
  // 
    // await expect(containerPedido).toContainText(order, { timeout: 10000 })
  // 
    // await expect(page.getByText('APROVADO')).toBeVisible()

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({ hasText: order.status })

      await expect(statusBadge).toHaveClass(/bg-red-100/)
      await expect(statusBadge).toHaveClass(/text-red-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-circle-x/)
  })

  test('deve consultar um pedido em análise', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-Z7GRYO',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Ivan Costa',
        email: 'ivancosta@teste.com',
      },
      payment: 'À Vista'
    }
  
    // Act
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number)
  
    // Assert
    // const containerPedido = page.getByRole('paragraph')
    //   .filter({ hasText: /^Pedido$/ }) // Filtra a busca por um elemento do tipo parágrafo com o nome exato Pedido (começar com ^ e terminar com $ diz que é para buscar o termo exato)
    //   .locator('..') // Sobe para o elemento pai da div que agrupa os elementos
  // 
    // await expect(containerPedido).toContainText(order, { timeout: 10000 })
  // 
    // await expect(page.getByText('APROVADO')).toBeVisible()

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({ hasText: order.status })

      await expect(statusBadge).toHaveClass(/bg-amber-100/)
      await expect(statusBadge).toHaveClass(/text-amber-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-clock/)
  })
  
  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
  
    // Test Data
    const order = generateOrderCode()
  
    // Act
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order)
  
    // Assert
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
  
  })
})