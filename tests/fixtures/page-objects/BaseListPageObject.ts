import { Page } from '@playwright/test';

import { BasePageObject, PageObjectOptions } from './BasePageObject';

export abstract class BaseListPageObject extends BasePageObject {
  protected abstract listSelector: string;
  protected abstract itemSelector: string;
  protected abstract loadingSelector: string;
  protected abstract emptyStateSelector: string;

  constructor(page: Page, options?: PageObjectOptions) {
    super(page, options);
  }

  // List-specific methods
  async waitForListToLoad(): Promise<void> {
    await this.waitForLoadingToComplete();

    // Wait for either items to appear or empty state
    try {
      await Promise.race([
        this.page.waitForSelector(this.itemSelector, { timeout: 10000 }),
        this.page.waitForSelector(this.emptyStateSelector, { timeout: 10000 }),
      ]);
    } catch {
      // If neither appears, the list might still be loading
      console.warn('List items or empty state not found within timeout');
    }
  }

  async getItemCount(): Promise<number> {
    await this.waitForListToLoad();
    return await this.getElementCount(this.itemSelector);
  }

  async getItemByIndex(index: number): Promise<string> {
    const items = this.page.locator(this.itemSelector);
    const item = items.nth(index);
    await item.waitFor({ state: 'visible' });
    return item.getAttribute('data-testid') || `item-${index}`;
  }

  async clickItemByIndex(index: number): Promise<void> {
    const items = this.page.locator(this.itemSelector);
    const item = items.nth(index);
    await item.waitFor({ state: 'visible' });
    await item.click();
  }

  async getItemTextByIndex(index: number): Promise<string> {
    const items = this.page.locator(this.itemSelector);
    const item = items.nth(index);
    await item.waitFor({ state: 'visible' });
    return (await item.textContent()) || '';
  }

  async isListEmpty(): Promise<boolean> {
    await this.waitForListToLoad();
    const itemCount = await this.getItemCount();
    return itemCount === 0;
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.isElementVisible(this.emptyStateSelector);
  }

  async isLoadingVisible(): Promise<boolean> {
    return await this.isElementVisible(this.loadingSelector);
  }

  // Search and filter methods
  async searchFor(query: string, searchInputSelector: string): Promise<void> {
    await this.fillInput(searchInputSelector, query);
    await this.waitForListToLoad();
  }

  async clearSearch(searchInputSelector: string): Promise<void> {
    await this.fillInput(searchInputSelector, '');
    await this.waitForListToLoad();
  }

  async applyFilter(filterSelector: string, value: string): Promise<void> {
    await this.selectOption(filterSelector, value);
    await this.waitForListToLoad();
  }

  async clearAllFilters(clearButtonSelector?: string): Promise<void> {
    if (clearButtonSelector) {
      await this.clickElement(clearButtonSelector);
    }
    await this.waitForListToLoad();
  }

  // Sorting methods
  async sortBy(
    sortSelector: string,
    direction?: 'asc' | 'desc'
  ): Promise<void> {
    await this.clickElement(sortSelector);

    if (direction) {
      // Check current sort direction and click again if needed
      const currentDirection = await this.getSortDirection(sortSelector);
      if (currentDirection !== direction) {
        await this.clickElement(sortSelector);
      }
    }

    await this.waitForListToLoad();
  }

  async getSortDirection(
    sortSelector: string
  ): Promise<'asc' | 'desc' | 'none'> {
    const element = this.page.locator(sortSelector);
    const ariaSort = await element.getAttribute('aria-sort');

    switch (ariaSort) {
      case 'ascending':
        return 'asc';
      case 'descending':
        return 'desc';
      default:
        return 'none';
    }
  }

  // Pagination methods (if applicable)
  async goToNextPage(nextButtonSelector: string): Promise<void> {
    await this.clickElement(nextButtonSelector);
    await this.waitForListToLoad();
  }

  async goToPreviousPage(prevButtonSelector: string): Promise<void> {
    await this.clickElement(prevButtonSelector);
    await this.waitForListToLoad();
  }

  async goToPage(
    pageNumber: number,
    pageButtonSelector: string
  ): Promise<void> {
    const pageButton = `${pageButtonSelector}[data-page="${pageNumber}"]`;
    await this.clickElement(pageButton);
    await this.waitForListToLoad();
  }

  // Bulk operations
  async selectAllItems(selectAllSelector: string): Promise<void> {
    await this.clickElement(selectAllSelector);
  }

  async selectItemByIndex(
    index: number,
    checkboxSelector?: string
  ): Promise<void> {
    if (checkboxSelector) {
      const items = this.page.locator(this.itemSelector);
      const item = items.nth(index);
      const checkbox = item.locator(checkboxSelector);
      await checkbox.click();
    } else {
      await this.clickItemByIndex(index);
    }
  }

  async getSelectedItemCount(selectedItemSelector: string): Promise<number> {
    return await this.getElementCount(selectedItemSelector);
  }

  // Performance testing methods
  async measureListLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.waitForListToLoad();
    return Date.now() - startTime;
  }

  async scrollToLoadMoreItems(loadMoreSelector?: string): Promise<void> {
    if (loadMoreSelector) {
      await this.scrollToElement(loadMoreSelector);
      await this.clickElement(loadMoreSelector);
    } else {
      // Infinite scroll
      await this.scrollToBottom();
    }
    await this.waitForListToLoad();
  }

  // Validation methods
  async validateListStructure(): Promise<boolean> {
    try {
      await this.expectElementToBeVisible(this.listSelector);

      const itemCount = await this.getItemCount();
      if (itemCount === 0) {
        return await this.isEmptyStateVisible();
      }

      // Validate first item structure
      const firstItem = this.page.locator(this.itemSelector).first();
      await firstItem.waitFor({ state: 'visible' });

      return true;
    } catch {
      return false;
    }
  }

  async validateItemsAreUnique(): Promise<boolean> {
    const itemCount = await this.getItemCount();
    const itemIds = new Set<string>();

    for (let i = 0; i < itemCount; i++) {
      const itemId = await this.getItemByIndex(i);
      if (itemIds.has(itemId)) {
        return false;
      }
      itemIds.add(itemId);
    }

    return true;
  }
}
