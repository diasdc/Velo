import { test, expect } from '@playwright/test'

/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {

  // Test Data
  const order = 'VLO-19H18S'

  // Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  // Assert
  const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ }) // Filtra a busca por um elemento do tipo parágrafo com o nome exato Pedido (começar com ^ e terminar com $ diz que é para buscar o termo exato)
    .locator('..') // Sobe para o elemento pai da div que agrupa os elementos

  await expect(containerPedido).toContainText(order, { timeout: 10000})

  await expect(page.getByText('APROVADO')).toBeVisible()
})