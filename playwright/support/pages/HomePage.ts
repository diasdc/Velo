import { Page, expect } from '@playwright/test'

export class HomePage {
  constructor(private page: Page) {}

  async goto(baseUrl = 'http://localhost:5173/') {
    await this.page.goto(baseUrl)
  }

  async expectHeroVisible() {
    await expect(
      this.page.getByTestId('hero-section').getByRole('heading')
    ).toContainText('Velô Sprint')
  }
}
