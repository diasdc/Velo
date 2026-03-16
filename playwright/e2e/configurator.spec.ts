import { test, expect } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectColor('Midnight Black')
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectWheels(/Sport Wheels/)
    await app.configurator.expectPrice('R$ 42.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')

    await app.configurator.selectWheels(/Aero Wheels/)
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
  })

  test('CT03 - deve atualizar o preço ao adicionar e remover opcionais e manter o valor no checkout', async ({ app, page }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.setOptional(/Precision Park/, true)
    await app.configurator.expectPrice('R$ 45.500,00')

    await app.configurator.setOptional(/Flux Capacitor/, true)
    await app.configurator.expectPrice('R$ 50.500,00')

    await app.configurator.setOptional(/Precision Park/, false)
    await app.configurator.setOptional(/Flux Capacitor/, false)
    await app.configurator.expectPrice('R$ 40.000,00')

    await page.getByRole('button', { name: 'Monte o Seu' }).click()
    await expect(page).toHaveURL(/\/order/)
    const summaryTotal = page.getByTestId('summary-total-price')
    await expect(summaryTotal).toBeVisible()
    await expect(summaryTotal).toHaveText('R$ 40.000,00')
  })
})
