import { LeadsPage } from '../../fixtures/page-objects/LeadsPage';
import { test, expect } from '../../setup';

test.describe('Leads List Error Handling and Edge Cases', () => {
  let leadsPage: LeadsPage;

  test.beforeEach(async ({ page }) => {
    leadsPage = new LeadsPage(page);
  });

  test.describe('Empty State Handling', () => {
    test('should display empty state when no leads match search criteria', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.searchLeads('nonexistentleadname12345xyz');

      // then
      await leadsPage.expectEmptyState();
    });

    test('should display helpful message in empty state', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.searchLeads('nonexistentleadname12345xyz');

      // then
      await leadsPage.expectEmptyState();
      const emptyStateElement = leadsPage.page.locator(
        '.text-center.py-16:has-text("No leads found")'
      );
      await expect(emptyStateElement).toContainText(
        'Try adjusting your search or filter criteria'
      );
    });

    test('should allow recovery from empty state by clearing filters', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const initialCount = await leadsPage.getLeadsCount();

      // Create empty state
      await leadsPage.searchLeads('nonexistentleadname12345xyz');
      await leadsPage.expectEmptyState();

      // when
      await leadsPage.searchLeads(''); // Clear search

      // then
      await leadsPage.expectLeadsToBeVisible();
      const recoveredCount = await leadsPage.getLeadsCount();
      expect(recoveredCount).toBe(initialCount);
    });
  });

  test.describe('Error State Handling', () => {
    test('should display error state when data loading fails', async ({
      page,
    }) => {
      // given
      // Mock network failure
      await page.route('**/data/leads.json', async (route) => {
        await route.abort('failed');
      });

      // when
      await leadsPage.navigateToLeads();

      // then
      await leadsPage.expectErrorState();
    });

    test('should display error state with retry button on network failure', async ({
      page,
    }) => {
      // given
      let requestCount = 0;
      await page.route('**/data/leads.json', async (route) => {
        requestCount++;
        console.log(`Request ${requestCount} to ${route.request().url()}`);
        if (requestCount <= 2) {
          // Fail first two requests (to handle React StrictMode double execution)
          console.log(`Aborting request ${requestCount}`);
          await route.abort('failed');
        } else {
          // Succeed on manual retry
          console.log('Continuing retry request');
          await route.continue();
        }
      });

      await leadsPage.navigateToLeads();
      await leadsPage.expectErrorState();

      // when
      await leadsPage.clickRetryButton();

      // then
      await leadsPage.waitForLeadsToLoad();
      await leadsPage.expectLeadsToBeVisible();
      expect(requestCount).toBe(3);
    });

    test('should display error state on server error (500)', async ({
      page,
    }) => {
      // given
      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      // when
      await leadsPage.navigateToLeads();

      // then
      await leadsPage.expectErrorState();
    });

    test('should maintain functionality after error recovery', async ({
      page,
    }) => {
      // given
      let requestCount = 0;
      await page.route('**/data/leads.json', async (route) => {
        requestCount++;
        console.log(`Request ${requestCount} to ${route.request().url()}`);
        if (requestCount <= 2) {
          // Fail first two requests (to handle React StrictMode double execution)
          console.log(`Aborting request ${requestCount}`);
          await route.abort('failed');
        } else {
          // Succeed on manual retry
          console.log('Continuing retry request');
          await route.continue();
        }
      });

      await leadsPage.navigateToLeads();

      // Wait a bit to ensure the error state appears before any automatic retry
      await page.waitForTimeout(100);
      await leadsPage.expectErrorState();

      // when
      await leadsPage.clickRetryButton();
      await leadsPage.waitForLeadsToLoad();

      // then
      await leadsPage.expectLeadsToBeVisible();

      // Verify functionality works after recovery
      await leadsPage.searchLeads('John');
      await leadsPage.filterByStatus('new');
      await leadsPage.sortByScore();

      // Should not cause errors
      const leadsCount = await leadsPage.getLeadsCount();
      expect(leadsCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Performance with Large Dataset', () => {
    test('should handle performance reasonably with existing data', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when - perform multiple operations to test performance
      const startTime = Date.now();

      await leadsPage.searchLeads('John');
      await leadsPage.searchLeads('');
      await leadsPage.filterByStatus('new');
      await leadsPage.filterByStatus('all');
      await leadsPage.sortByScore();

      const totalTime = Date.now() - startTime;

      // then
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds

      const finalCount = await leadsPage.getLeadsCount();
      expect(finalCount).toBeGreaterThan(0);
    });
  });

  test.describe('Edge Case Scenarios', () => {
    test('should handle rapid filter changes without errors', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when - rapidly change filters
      await leadsPage.filterByStatus('new');
      await leadsPage.filterByStatus('contacted');
      await leadsPage.filterByStatus('qualified');
      await leadsPage.filterByStatus('unqualified');
      await leadsPage.filterByStatus('all');

      // then
      await leadsPage.expectLeadsToBeVisible();
      const finalCount = await leadsPage.getLeadsCount();
      expect(finalCount).toBeGreaterThanOrEqual(0);
    });

    test('should handle rapid search input changes', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when - rapidly change search terms
      await leadsPage.searchLeads('a');
      await leadsPage.searchLeads('ab');
      await leadsPage.searchLeads('abc');
      await leadsPage.searchLeads('abcd');
      await leadsPage.searchLeads('');

      // then
      await leadsPage.expectLeadsToBeVisible();
      const finalCount = await leadsPage.getLeadsCount();
      expect(finalCount).toBeGreaterThanOrEqual(0);
    });
  });
});
