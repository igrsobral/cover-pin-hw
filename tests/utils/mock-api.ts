import { Page } from '@playwright/test';

import { TestLead, TestOpportunity } from '../fixtures/test-data';

export class MockApi {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async mockLeadsApi(leads: TestLead[]): Promise<void> {
    await this.page.route('**/data/leads.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(leads),
      });
    });
  }

  async mockOpportunitiesApi(opportunities: TestOpportunity[]): Promise<void> {
    await this.page.route('**/data/opportunities.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(opportunities),
      });
    });
  }

  async mockApiError(
    endpoint: string,
    statusCode: number = 500
  ): Promise<void> {
    await this.page.route(`**/${endpoint}`, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });
  }

  async mockApiDelay(endpoint: string, delayMs: number = 1000): Promise<void> {
    await this.page.route(`**/${endpoint}`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      route.continue();
    });
  }

  async mockLeadUpdate(
    leadId: string,
    updatedLead: Partial<TestLead>
  ): Promise<void> {
    await this.page.route(`**/leads/${leadId}`, async (route) => {
      if (
        route.request().method() === 'PUT' ||
        route.request().method() === 'PATCH'
      ) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...updatedLead, id: leadId }),
        });
      } else {
        route.continue();
      }
    });
  }

  async mockOpportunityCreation(opportunity: TestOpportunity): Promise<void> {
    await this.page.route('**/opportunities', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(opportunity),
        });
      } else {
        route.continue();
      }
    });
  }

  async simulateNetworkFailure(endpoint: string): Promise<void> {
    await this.page.route(`**/${endpoint}`, async (route) => {
      await route.abort('failed');
    });
  }

  async clearAllMocks(): Promise<void> {
    await this.page.unroute('**/*');
  }
}
