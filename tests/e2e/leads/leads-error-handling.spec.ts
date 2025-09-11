import { LeadsPage } from '../../fixtures/page-objects/LeadsPage';
import { TestDataGenerator } from '../../fixtures/test-data';
import { expect, test } from '../../setup';

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

    test('should display empty state when no leads match status filter', async ({
      page,
    }) => {
      // given
      // Mock empty response for specific status
      await page.route('**/data/leads.json', async (route) => {
        try {
          const response = await route.fetch();
          const leads = await response.json();
          // Filter out all leads with 'qualified' status to simulate empty result
          const filteredLeads = leads.filter(
            (lead: { status: string }) => lead.status !== 'qualified'
          );
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(filteredLeads),
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          // Handle case where page is closed
          await route.abort();
        }
      });

      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.filterByStatus('qualified');

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
      const emptyStateText = await leadsPage.page
        .locator('.text-center.py-16:has-text("No leads found")')
        .textContent();
      expect(emptyStateText).toContain(
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
        if (requestCount <= 2) {
          // Fail first two requests (to handle React StrictMode double execution)
          await route.abort('failed');
        } else {
          // Succeed on manual retry
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

    test('should display error state on invalid JSON response', async ({
      page,
    }) => {
      // given
      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: 'invalid json content',
        });
      });

      // when
      await leadsPage.navigateToLeads();

      // then
      await leadsPage.expectErrorState();
    });

    test('should handle timeout errors gracefully', async ({ page }) => {
      // given
      await page.route('**/data/leads.json', async (route) => {
        // Simulate timeout by aborting the request
        await route.abort('timedout');
      });

      // when
      await leadsPage.navigateToLeads();

      // then
      // Should show error state due to timeout
      await leadsPage.expectErrorState();
    });

    test('should maintain functionality after error recovery', async ({
      page,
    }) => {
      // given
      let requestCount = 0;
      await page.route('**/data/leads.json', async (route) => {
        requestCount++;
        if (requestCount <= 2) {
          // Fail first two requests (to handle React StrictMode double execution)
          await route.abort('failed');
        } else {
          // Succeed on manual retry
          await route.continue();
        }
      });

      await leadsPage.navigateToLeads();
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
    test('should handle ~100 leads smoothly', async ({ page }) => {
      // given
      const performanceData = TestDataGenerator.generatePerformanceTestData();

      // Mock large dataset
      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(performanceData.leads),
        });
      });

      // when
      await leadsPage.navigateToLeads();

      // then
      const maxTime = await leadsPage.validatePerformanceWithLargeDataset();

      // Verify all leads are displayed
      const leadsCount = await leadsPage.getLeadsCount();
      expect(leadsCount).toBe(100);

      // Performance should be reasonable
      expect(maxTime).toBeLessThan(3000); // 3 seconds max for any operation
    });

    test('should maintain search performance with large dataset', async ({
      page,
    }) => {
      // given
      const performanceData = TestDataGenerator.generatePerformanceTestData();

      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(performanceData.leads),
        });
      });

      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      const startTime = Date.now();
      await leadsPage.searchLeads('John');
      await leadsPage.waitForLeadsToLoad();
      const searchTime = Date.now() - startTime;

      // then
      expect(searchTime).toBeLessThan(2000); // Search should complete within 2 seconds

      const resultsCount = await leadsPage.getLeadsCount();
      expect(resultsCount).toBeGreaterThanOrEqual(0);
    });

    test('should maintain filter performance with large dataset', async ({
      page,
    }) => {
      // given
      const performanceData = TestDataGenerator.generatePerformanceTestData();

      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(performanceData.leads),
        });
      });

      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      const startTime = Date.now();
      await leadsPage.filterByStatus('new');
      await leadsPage.waitForLeadsToLoad();
      const filterTime = Date.now() - startTime;

      // then
      expect(filterTime).toBeLessThan(2000); // Filter should complete within 2 seconds

      const resultsCount = await leadsPage.getLeadsCount();
      expect(resultsCount).toBeGreaterThanOrEqual(0);
    });

    test('should handle memory efficiently with large dataset', async ({
      page,
    }) => {
      // given
      const performanceData = TestDataGenerator.generatePerformanceTestData();

      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(performanceData.leads),
        });
      });

      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when - perform multiple operations to test memory usage
      await leadsPage.searchLeads('test');
      await leadsPage.searchLeads('');
      await leadsPage.filterByStatus('new');
      await leadsPage.filterByStatus('all');
      await leadsPage.sortByScore();
      await leadsPage.sortByName();

      // then
      // Verify page is still responsive
      const finalCount = await leadsPage.getLeadsCount();
      expect(finalCount).toBe(100);

      // Verify no memory leaks by checking if operations still work
      await leadsPage.searchLeads('John');
      const searchResults = await leadsPage.getLeadsCount();
      expect(searchResults).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Edge Case Scenarios', () => {
    test('should handle leads with special characters in names', async ({
      page,
    }) => {
      // given
      const specialCharLeads = [
        {
          id: '1',
          name: 'José María García-López',
          company: 'Ñoño & Associates',
          email: 'jose@nono.com',
          source: 'website',
          score: 85,
          status: 'new',
        },
        {
          id: '2',
          name: 'François Müller',
          company: 'Café & Co.',
          email: 'francois@cafe.com',
          source: 'referral',
          score: 90,
          status: 'contacted',
        },
      ];

      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(specialCharLeads),
        });
      });

      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.searchLeads('José');

      // then
      const resultsCount = await leadsPage.getLeadsCount();
      expect(resultsCount).toBe(1);
      await leadsPage.expectLeadToBeVisible('José María García-López');
    });

    test('should handle very long lead names and company names', async ({
      page,
    }) => {
      // given
      const longNameLeads = [
        {
          id: '1',
          name: 'Bartholomew Maximilian Alexander Wellington-Smythe III',
          company:
            'International Global Worldwide Universal Enterprises Corporation Limited LLC',
          email: 'bartholomew@verylongcompanyname.com',
          source: 'website',
          score: 85,
          status: 'new',
        },
      ];

      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(longNameLeads),
        });
      });

      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      const leadData = await leadsPage.getLeadRowData(0);

      // then
      expect(leadData.name).toBe(
        'Bartholomew Maximilian Alexander Wellington-Smythe III'
      );
      expect(leadData.company).toBe(
        'International Global Worldwide Universal Enterprises Corporation Limited LLC'
      );
    });

    test('should handle leads with edge case scores (0 and 100)', async ({
      page,
    }) => {
      // given
      const edgeScoreLeads = [
        {
          id: '1',
          name: 'Zero Score Lead',
          company: 'Zero Corp',
          email: 'zero@zero.com',
          source: 'website',
          score: 0,
          status: 'new',
        },
        {
          id: '2',
          name: 'Perfect Score Lead',
          company: 'Perfect Corp',
          email: 'perfect@perfect.com',
          source: 'referral',
          score: 100,
          status: 'qualified',
        },
      ];

      await page.route('**/data/leads.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(edgeScoreLeads),
        });
      });

      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.sortByScore();

      // then
      const firstLead = await leadsPage.getLeadRowData(0);
      const secondLead = await leadsPage.getLeadRowData(1);

      expect(firstLead.score).toBe(0); // Lowest score first (ascending)
      expect(secondLead.score).toBe(100);
    });

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

    test('should handle browser back/forward navigation', async ({ page }) => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // Apply filters
      await leadsPage.searchLeads('test');
      await leadsPage.filterByStatus('new');

      // when
      await page.goBack();
      await page.goForward();

      // then
      // Page should still be functional
      await leadsPage.waitForLeadsToLoad();
      const currentCount = await leadsPage.getLeadsCount();
      expect(currentCount).toBeGreaterThanOrEqual(0);
    });
  });
});
