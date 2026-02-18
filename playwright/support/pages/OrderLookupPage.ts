import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export interface OrderDetails {
  number: string
  status: OrderStatus
  color: string
  wheels: string
  customer: { name: string; email: string }
  payment: string
}

interface StatusBadgeConfig {
  bgClass: string
  textClass: string
  iconClass: string
}

export class OrderLookupPage {
  private readonly statusConfigs: Record<OrderStatus, StatusBadgeConfig> = {
    APROVADO: {
      bgClass: 'bg-green-100',
      textClass: 'text-green-700',
      iconClass: 'lucide-circle-check-big'
    },
    REPROVADO: {
      bgClass: 'bg-red-100',
      textClass: 'text-red-700',
      iconClass: 'lucide-circle-x'
    },
    EM_ANALISE: {
      bgClass: 'bg-amber-100',
      textClass: 'text-amber-700',
      iconClass: 'lucide-clock'
    }
  }

  constructor(private page: Page) {}

  async expectPageLoaded() {
    await expect(this.page.getByRole('heading')).toContainText('Consultar Pedido')
  }

  async searchOrder(code: string) {
    await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
    await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
  }

  async validateStatusBadge(status: OrderStatus) {
    const config = this.statusConfigs[status]
    const statusBadge = this.page.getByRole('status').filter({ hasText: status })

    // Valida as classes CSS do badge
    await expect(statusBadge).toHaveClass(new RegExp(config.bgClass))
    await expect(statusBadge).toHaveClass(new RegExp(config.textClass))

    // Valida o ícone do badge
    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(new RegExp(config.iconClass))
  }

  async validateOrderDetails(order: OrderDetails) {
    const container = this.page.getByTestId(`order-result-${order.number}`)
    const snapshot = `
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
      `
    await expect(container).toMatchAriaSnapshot(snapshot)
  }

  async validateOrderNotFound() {
    await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
  }
}