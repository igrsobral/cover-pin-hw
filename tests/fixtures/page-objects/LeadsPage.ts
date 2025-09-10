import { Locator, Page, expect } from '@playwright/test';

import { BasePageObject } from './BasePageObject';

import type { TestLead } from '../test-data';

export interface LeadsPageActions {
  navigateToLeads(): Promise<void>;
  searchLeads(query: string): Promise<void>;
  filterByStatus(status: string): Promise<void>;
  sortByScore(): Promise<void>;
  sortByName(): Promise<void>;
  sortByCompany(): Promise<void>;
  sortByStatus(): Promise<void>;
  clickLead(leadName: string): Promise<void>;
  clickLeadByIndex(index: number): Promise<void>;
  getLeadsCount(): Promise<number>;
  getVisibleLeadsCount(): Promise<number>;
  waitForLeadsToLoad(): Promise<void>;
  clearFilters(): Promise<void>;
  getLeadByName(name: string): Promise<Locator>;
  getLeadRowData(index: number): Promise<TestLead>;
  getAllLeadNames(): Promise<string[]>;
  isEmptyStateVisible(): Promise<boolean>;
  isLoadingStateVisible(): Promise<boolean>;
  isErrorStateVisible(): Promise<boolean>;
  getErrorMessage(): Promise<string>;
  clickRetryButton(): Promise<void>;
  getSortDirection(field: string): Promise<'asc' | 'desc' | 'none'>;
  validateLeadsSortedByScore(direction: 'asc' | 'desc'): Promise<void>;
  validatePerformanceWithLargeDataset(): Promise<number>;
}

export class LeadsPage extends BasePageObject implements LeadsPageActions {
  // Selectors
  private readonly selectors = {
    // Page elements
    pageTitle: 'h1:has-text("Leads")',
    leadsCounter: 'div:has-text("of") >> text=/\\d+ of \\d+ leads/',

    // Search and filters
    searchInput: 'input[placeholder*="Search by name or company"]',
    statusSelect: 'select:near(label:has-text("Status"))',
    clearFiltersButton: 'button:has-text("Clear All")',

    // Table elements
    leadsTable: 'table',
    tableHeader: 'thead',
    tableBody: 'tbody',
    leadRows: 'tbody tr',

    // Sort headers
    nameHeader: 'th:has-text("Name")',
    companyHeader: 'th:has-text("Company")',
    scoreHeader: 'th:has-text("Score")',
    statusHeader: 'th:has-text("Status")',

    // Loading and error states
    loadingSpinner: '.animate-spin',
    errorMessage: '.text-center.py-16:has-text("Error loading data")',
    retryButton: 'button:has-text("Try Again")',
    emptyState: '.text-center.py-16:has-text("No leads found")',

    // Lead row cells
    leadNameCell: 'td:nth-child(1)',
    leadCompanyCell: 'td:nth-child(2)',
    leadEmailCell: 'td:nth-child(3)',
    leadSourceCell: 'td:nth-child(4)',
    leadScoreCell: 'td:nth-child(5)',
    leadStatusCell: 'td:nth-child(6)',
  };

  constructor(page: Page) {
    super(page);
  }

  async navigateToLeads(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForLeadsToLoad();
  }

  async searchLeads(query: string): Promise<void> {
    await this.fillInput(this.selectors.searchInput, query);
    // Wait for search to be applied (debounced)
    await this.waitForTimeout(500);
    await this.waitForLeadsToLoad();
  }

  async filterByStatus(status: string): Promise<void> {
    await this.selectOption(this.selectors.statusSelect, status);
    await this.waitForLeadsToLoad();
  }

  async sortByScore(): Promise<void> {
    await this.clickElement(this.selectors.scoreHeader);
    await this.waitForTimeout(300); // Wait for sort to apply
  }

  async sortByName(): Promise<void> {
    await this.clickElement(this.selectors.nameHeader);
    await this.waitForTimeout(300);
  }

  async sortByCompany(): Promise<void> {
    await this.clickElement(this.selectors.companyHeader);
    await this.waitForTimeout(300);
  }

  async sortByStatus(): Promise<void> {
    await this.clickElement(this.selectors.statusHeader);
    await this.waitForTimeout(300);
  }

  async clickLead(leadName: string): Promise<void> {
    const leadRow = this.page.locator(`tr:has(td:has-text("${leadName}"))`);
    await leadRow.click();
  }

  async clickLeadByIndex(index: number): Promise<void> {
    const leadRow = this.page.locator(this.selectors.leadRows).nth(index);
    await leadRow.click();
  }

  async getLeadsCount(): Promise<number> {
    return await this.getElementCount(this.selectors.leadRows);
  }

  async getVisibleLeadsCount(): Promise<number> {
    const counterText = await this.getElementText(this.selectors.leadsCounter);
    const match = counterText.match(/(\d+) of \d+ leads/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async waitForLeadsToLoad(): Promise<void> {
    // Wait for loading spinner to disappear
    try {
      await this.page.waitForSelector(this.selectors.loadingSpinner, {
        state: 'detached',
        timeout: 10000,
      });
    } catch {
      // Loading spinner might not appear for fast loads
    }

    // Wait for either table or empty state to be visible
    await Promise.race([
      this.page.waitForSelector(this.selectors.leadsTable, {
        state: 'visible',
      }),
      this.page.waitForSelector(this.selectors.emptyState, {
        state: 'visible',
      }),
      this.page.waitForSelector(this.selectors.errorMessage, {
        state: 'visible',
      }),
    ]);
  }

  async clearFilters(): Promise<void> {
    const clearButton = this.page.locator(this.selectors.clearFiltersButton);
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await this.waitForLeadsToLoad();
    }
  }

  async getLeadByName(name: string): Promise<Locator> {
    return this.page.locator(`tr:has(td:has-text("${name}"))`);
  }

  async getLeadRowData(index: number): Promise<TestLead> {
    const row = this.page.locator(this.selectors.leadRows).nth(index);

    const name =
      (await row.locator(this.selectors.leadNameCell).textContent()) || '';
    const company =
      (await row.locator(this.selectors.leadCompanyCell).textContent()) || '';
    const email =
      (await row.locator(this.selectors.leadEmailCell).textContent()) || '';
    const source =
      (await row.locator(this.selectors.leadSourceCell).textContent()) || '';
    const scoreText =
      (await row.locator(this.selectors.leadScoreCell).textContent()) || '0';
    const statusElement = row.locator(this.selectors.leadStatusCell);
    const statusText = (await statusElement.textContent()) || '';

    return {
      id: `${index + 1}`, // Approximate ID based on position
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      source: source.trim().toLowerCase().replace(' ', '_'),
      score: parseInt(scoreText.trim(), 10),
      status: statusText.trim().toLowerCase() as TestLead['status'],
    };
  }

  async getAllLeadNames(): Promise<string[]> {
    const nameElements = this.page.locator(
      `${this.selectors.leadRows} ${this.selectors.leadNameCell}`
    );
    const count = await nameElements.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await nameElements.nth(i).textContent();
      if (name) {
        names.push(name.trim());
      }
    }

    return names;
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.emptyState);
  }

  async isLoadingStateVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.loadingSpinner);
  }

  async isErrorStateVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isErrorStateVisible()) {
      return await this.getElementText(`${this.selectors.errorMessage} p`);
    }
    return '';
  }

  async clickRetryButton(): Promise<void> {
    if (await this.isErrorStateVisible()) {
      await this.clickElement(this.selectors.retryButton);
      await this.waitForLeadsToLoad();
    }
  }

  async getSortDirection(field: string): Promise<'asc' | 'desc' | 'none'> {
    let headerSelector: string;

    switch (field.toLowerCase()) {
      case 'name':
        headerSelector = this.selectors.nameHeader;
        break;
      case 'company':
        headerSelector = this.selectors.companyHeader;
        break;
      case 'score':
        headerSelector = this.selectors.scoreHeader;
        break;
      case 'status':
        headerSelector = this.selectors.statusHeader;
        break;
      default:
        throw new Error(`Unknown sort field: ${field}`);
    }

    const header = this.page.locator(headerSelector);
    const ariaLabel = (await header.getAttribute('aria-label')) || '';

    if (ariaLabel.includes('descending')) {
      return 'asc'; // Currently ascending, next click will be descending
    } else if (ariaLabel.includes('ascending')) {
      return 'desc'; // Currently descending, next click will be ascending
    }

    return 'none';
  }

  async validateLeadsSortedByScore(direction: 'asc' | 'desc'): Promise<void> {
    const scoreElements = this.page.locator(
      `${this.selectors.leadRows} ${this.selectors.leadScoreCell}`
    );
    const count = await scoreElements.count();

    if (count === 0) return;

    const scores: number[] = [];
    for (let i = 0; i < count; i++) {
      const scoreText = await scoreElements.nth(i).textContent();
      scores.push(parseInt(scoreText?.trim() || '0', 10));
    }

    // Check if scores are sorted in the expected direction
    for (let i = 0; i < scores.length - 1; i++) {
      if (direction === 'desc') {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
      } else {
        expect(scores[i]).toBeLessThanOrEqual(scores[i + 1]);
      }
    }
  }

  async validatePerformanceWithLargeDataset(): Promise<number> {
    const startTime = Date.now();

    // Measure initial load time
    await this.waitForLeadsToLoad();
    const loadTime = Date.now() - startTime;

    // Verify all leads are rendered
    const leadsCount = await this.getLeadsCount();
    expect(leadsCount).toBeGreaterThan(0);

    // Test search performance
    const searchStartTime = Date.now();
    await this.searchLeads('John');
    await this.waitForLeadsToLoad();
    const searchTime = Date.now() - searchStartTime;

    // Test sort performance
    const sortStartTime = Date.now();
    await this.sortByScore();
    const sortTime = Date.now() - sortStartTime;

    // Clear search to reset
    await this.searchLeads('');

    // Performance should be reasonable (under 2 seconds for each operation)
    expect(loadTime).toBeLessThan(2000);
    expect(searchTime).toBeLessThan(2000);
    expect(sortTime).toBeLessThan(2000);

    return Math.max(loadTime, searchTime, sortTime);
  }

  // Assertion helpers
  async expectLeadsToBeVisible(): Promise<void> {
    await this.expectElementToBeVisible(this.selectors.leadsTable);
  }

  async expectEmptyState(): Promise<void> {
    await this.expectElementToBeVisible(this.selectors.emptyState);
    await this.expectElementToContainText(
      this.selectors.emptyState,
      'No leads found'
    );
  }

  async expectErrorState(errorMessage?: string): Promise<void> {
    await this.expectElementToBeVisible(this.selectors.errorMessage);
    if (errorMessage) {
      await this.expectElementToContainText(
        this.selectors.errorMessage,
        errorMessage
      );
    }
  }

  async expectLoadingState(): Promise<void> {
    await this.expectElementToBeVisible(this.selectors.loadingSpinner);
  }

  async expectLeadCount(count: number): Promise<void> {
    const actualCount = await this.getLeadsCount();
    expect(actualCount).toBe(count);
  }

  async expectLeadToBeVisible(leadName: string): Promise<void> {
    const leadRow = await this.getLeadByName(leadName);
    await expect(leadRow).toBeVisible();
  }

  async expectLeadNotToBeVisible(leadName: string): Promise<void> {
    const leadRow = await this.getLeadByName(leadName);
    await expect(leadRow).not.toBeVisible();
  }

  async expectSearchResults(
    query: string,
    expectedCount?: number
  ): Promise<void> {
    const names = await this.getAllLeadNames();
    const matchingNames = names.filter((name) =>
      name.toLowerCase().includes(query.toLowerCase())
    );

    if (expectedCount !== undefined) {
      expect(matchingNames.length).toBe(expectedCount);
    } else {
      expect(matchingNames.length).toBeGreaterThan(0);
    }
  }

  async expectStatusFilter(
    status: string,
    expectedCount?: number
  ): Promise<void> {
    const leadsCount = await this.getLeadsCount();

    if (status === 'all') {
      expect(leadsCount).toBeGreaterThan(0);
    } else if (expectedCount !== undefined) {
      expect(leadsCount).toBe(expectedCount);
    }

    // Verify all visible leads have the expected status (if not 'all')
    if (status !== 'all' && leadsCount > 0) {
      for (let i = 0; i < Math.min(leadsCount, 5); i++) {
        // Check first 5 leads
        const leadData = await this.getLeadRowData(i);
        expect(leadData.status).toBe(status);
      }
    }
  }
}
