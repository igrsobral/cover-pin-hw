import type { TestLead, TestOpportunity } from '../fixtures/test-data';
import type { BrowserContext, Page } from '@playwright/test';

export class TestHelpers {
  static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
    });
  }

  static async setLocalStorageItem(
    page: Page,
    key: string,
    value: TestLead | TestOpportunity
  ): Promise<void> {
    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      { key, value }
    );
  }

  static async getLocalStorageItem<T>(
    page: Page,
    key: string
  ): Promise<T | null> {
    return await page.evaluate((key) => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }, key);
  }

  static async mockNetworkDelay(
    page: Page,
    delayMs: number = 500
  ): Promise<void> {
    await page.route('**/data/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      route.continue();
    });
  }

  static async mockNetworkFailure(
    page: Page,
    failureRate: number = 0.1
  ): Promise<void> {
    await page.route('**/data/**', async (route) => {
      if (Math.random() < failureRate) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
  }

  static async interceptApiCall<T>(
    page: Page,
    url: string,
    response: T
  ): Promise<void> {
    await page.route(url, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }

  static async waitForApiCall(page: Page, url: string): Promise<void> {
    await page.waitForResponse(
      (response) => response.url().includes(url) && response.status() === 200
    );
  }

  static async measurePerformance(
    page: Page,
    action: () => Promise<void>
  ): Promise<number> {
    const startTime = Date.now();
    await action();
    return Date.now() - startTime;
  }

  static async simulateSlowNetwork(context: BrowserContext): Promise<void> {
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.continue();
    });
  }

  static async validateLeadData(
    page: Page,
    expectedLead: TestLead
  ): Promise<void> {
    const leadElement = page.locator(`[data-testid="lead-${expectedLead.id}"]`);
    await leadElement.waitFor();

    // Validate lead fields are displayed correctly
    await page.locator(`text=${expectedLead.name}`).waitFor();
    await page.locator(`text=${expectedLead.company}`).waitFor();
    await page.locator(`text=${expectedLead.email}`).waitFor();
  }

  static async validateOpportunityData(
    page: Page,
    expectedOpportunity: TestOpportunity
  ): Promise<void> {
    const opportunityElement = page.locator(
      `[data-testid="opportunity-${expectedOpportunity.id}"]`
    );
    await opportunityElement.waitFor();

    // Validate opportunity fields are displayed correctly
    await page.locator(`text=${expectedOpportunity.name}`).waitFor();
    await page.locator(`text=${expectedOpportunity.stage}`).waitFor();
    await page.locator(`text=${expectedOpportunity.accountName}`).waitFor();
  }
}
