import { LeadsPage } from '../../fixtures/page-objects/LeadsPage';
import { expect, test } from '../../setup';

test.describe('Leads List Functionality', () => {
  let leadsPage: LeadsPage;

  test.beforeEach(async ({ page }) => {
    leadsPage = new LeadsPage(page);
  });

  test.describe('Lead Loading and Display', () => {
    test('should load and display leads from JSON data', async () => {
      // given
      await leadsPage.navigateToLeads();

      // when
      await leadsPage.waitForLeadsToLoad();

      // then
      await leadsPage.expectLeadsToBeVisible();
      const leadsCount = await leadsPage.getLeadsCount();
      expect(leadsCount).toBeGreaterThan(0);
    });

    test('should handle loading state properly', async () => {
      // given
      await leadsPage.navigateToLeads();

      // when
      await leadsPage.waitForLeadsToLoad();

      // then
      // Verify that loading completed and leads are visible
      await leadsPage.expectLeadsToBeVisible();
      const leadsCount = await leadsPage.getLeadsCount();
      expect(leadsCount).toBeGreaterThan(0);
    });

    test('should display correct lead count in header', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      const actualCount = await leadsPage.getLeadsCount();
      const displayedCount = await leadsPage.getVisibleLeadsCount();

      // then
      expect(displayedCount).toBe(actualCount);
      expect(actualCount).toBeGreaterThan(0);
    });

    test('should display all lead fields correctly', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      const leadData = await leadsPage.getLeadRowData(0);

      // then
      expect(leadData.name).toBeTruthy();
      expect(leadData.company).toBeTruthy();
      expect(leadData.email).toBeTruthy();
      expect(leadData.source).toBeTruthy();
      expect(leadData.score).toBeGreaterThanOrEqual(0);
      expect(leadData.score).toBeLessThanOrEqual(100);
      expect(['new', 'contacted', 'qualified', 'unqualified']).toContain(
        leadData.status
      );
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter leads by name', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const allNames = await leadsPage.getAllLeadNames();
      const searchName = allNames[0].split(' ')[0]; // Use first name

      // when
      await leadsPage.searchLeads(searchName);

      // then
      await leadsPage.expectSearchResults(searchName);
      const filteredNames = await leadsPage.getAllLeadNames();
      expect(filteredNames.length).toBeLessThanOrEqual(allNames.length);

      // Verify all visible leads contain the search term
      for (const name of filteredNames) {
        expect(name.toLowerCase()).toContain(searchName.toLowerCase());
      }
    });

    test('should filter leads by company name', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const firstLead = await leadsPage.getLeadRowData(0);
      const companySearchTerm = firstLead.company.split(' ')[0]; // Use first word of company

      // when
      await leadsPage.searchLeads(companySearchTerm);

      // then
      const leadsCount = await leadsPage.getLeadsCount();
      expect(leadsCount).toBeGreaterThan(0);

      // Verify at least one lead matches the company search
      let foundMatch = false;
      for (let i = 0; i < Math.min(leadsCount, 3); i++) {
        const leadData = await leadsPage.getLeadRowData(i);
        if (
          leadData.company
            .toLowerCase()
            .includes(companySearchTerm.toLowerCase())
        ) {
          foundMatch = true;
          break;
        }
      }
      expect(foundMatch).toBe(true);
    });

    test('should handle case-insensitive search', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const firstLead = await leadsPage.getLeadRowData(0);
      const searchTerm = firstLead.name.split(' ')[0];

      // when
      await leadsPage.searchLeads(searchTerm.toUpperCase());

      // then
      const leadsCount = await leadsPage.getLeadsCount();
      expect(leadsCount).toBeGreaterThan(0);
      await leadsPage.expectLeadToBeVisible(firstLead.name);
    });

    test('should clear search results when search is cleared', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const initialCount = await leadsPage.getLeadsCount();

      // Apply search filter
      await leadsPage.searchLeads('test');
      const filteredCount = await leadsPage.getLeadsCount();

      // when
      await leadsPage.searchLeads(''); // Clear search

      // then
      const finalCount = await leadsPage.getLeadsCount();
      expect(finalCount).toBe(initialCount);
      expect(finalCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('should show empty state for no search results', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.searchLeads('nonexistentleadname12345');

      // then
      await leadsPage.expectEmptyState();
    });
  });

  test.describe('Status Filter Functionality', () => {
    test('should filter leads by "new" status', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.filterByStatus('new');

      // then
      await leadsPage.expectStatusFilter('new');
    });

    test('should filter leads by "contacted" status', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.filterByStatus('contacted');

      // then
      await leadsPage.expectStatusFilter('contacted');
    });

    test('should filter leads by "qualified" status', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.filterByStatus('qualified');

      // then
      await leadsPage.expectStatusFilter('qualified');
    });

    test('should filter leads by "unqualified" status', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.filterByStatus('unqualified');

      // then
      await leadsPage.expectStatusFilter('unqualified');
    });

    test('should show all leads when "all" status is selected', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const initialCount = await leadsPage.getLeadsCount();

      // Apply a status filter first
      await leadsPage.filterByStatus('new');
      const filteredCount = await leadsPage.getLeadsCount();

      // when
      await leadsPage.filterByStatus('all');

      // then
      const finalCount = await leadsPage.getLeadsCount();
      expect(finalCount).toBe(initialCount);
      expect(finalCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('should combine search and status filters', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const firstLead = await leadsPage.getLeadRowData(0);

      // when
      await leadsPage.searchLeads(firstLead.name.split(' ')[0]);
      await leadsPage.filterByStatus(firstLead.status);

      // then
      const leadsCount = await leadsPage.getLeadsCount();
      if (leadsCount > 0) {
        const leadData = await leadsPage.getLeadRowData(0);
        expect(leadData.status).toBe(firstLead.status);
        expect(leadData.name.toLowerCase()).toContain(
          firstLead.name.split(' ')[0].toLowerCase()
        );
      }
    });
  });

  test.describe('Score Sorting Functionality', () => {
    test('should sort leads by score when clicked', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.sortByScore();

      // then
      // First click should sort in ascending order
      await leadsPage.validateLeadsSortedByScore('asc');
    });

    test('should toggle score sort direction on multiple clicks', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when - first click (ascending)
      await leadsPage.sortByScore();
      await leadsPage.validateLeadsSortedByScore('asc');

      // when - second click (descending)
      await leadsPage.sortByScore();
      await leadsPage.validateLeadsSortedByScore('desc');

      // when - third click (ascending again)
      await leadsPage.sortByScore();
      await leadsPage.validateLeadsSortedByScore('asc');
    });

    test('should sort leads by name', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.sortByName();

      // then
      const names = await leadsPage.getAllLeadNames();
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    test('should sort leads by company', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.sortByCompany();

      // then
      const leadsCount = await leadsPage.getLeadsCount();
      if (leadsCount > 1) {
        const companies: string[] = [];
        for (let i = 0; i < Math.min(leadsCount, 5); i++) {
          const leadData = await leadsPage.getLeadRowData(i);
          companies.push(leadData.company);
        }
        const sortedCompanies = [...companies].sort();
        expect(companies).toEqual(sortedCompanies);
      }
    });

    test('should sort leads by status', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.sortByStatus();

      // then
      const leadsCount = await leadsPage.getLeadsCount();
      if (leadsCount > 1) {
        const statuses: string[] = [];
        for (let i = 0; i < Math.min(leadsCount, 5); i++) {
          const leadData = await leadsPage.getLeadRowData(i);
          statuses.push(leadData.status);
        }
        const sortedStatuses = [...statuses].sort();
        expect(statuses).toEqual(sortedStatuses);
      }
    });

    test('should maintain sort order when filtering', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // when
      await leadsPage.sortByScore();
      await leadsPage.filterByStatus('new');

      // then
      const leadsCount = await leadsPage.getLeadsCount();
      if (leadsCount > 1) {
        await leadsPage.validateLeadsSortedByScore('asc');
      }
    });
  });

  test.describe('Lead Interaction', () => {
    test('should allow clicking on lead rows', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const leadsCount = await leadsPage.getLeadsCount();

      if (leadsCount > 0) {
        const firstLead = await leadsPage.getLeadRowData(0);

        // when
        await leadsPage.clickLead(firstLead.name);

        // then
        // The lead detail panel should open (this will be tested in detail panel tests)
        // For now, we just verify the click doesn't cause errors
        await leadsPage.waitForTimeout(500);
      }
    });

    test('should support keyboard navigation on lead rows', async ({
      page,
    }) => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const leadsCount = await leadsPage.getLeadsCount();

      if (leadsCount > 0) {
        // when
        await page.keyboard.press('Tab'); // Focus on first interactive element
        await page.keyboard.press('Enter'); // Activate first lead row

        // then
        // Verify no errors occurred and page is still functional
        await leadsPage.waitForTimeout(500);
        await leadsPage.expectLeadsToBeVisible();
      }
    });
  });

  test.describe('Clear Filters Functionality', () => {
    test('should clear all active filters', async () => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();
      const initialCount = await leadsPage.getLeadsCount();

      // Apply multiple filters
      await leadsPage.searchLeads('test');
      await leadsPage.filterByStatus('new');
      const filteredCount = await leadsPage.getLeadsCount();

      // when
      await leadsPage.clearFilters();

      // then
      const finalCount = await leadsPage.getLeadsCount();
      expect(finalCount).toBe(initialCount);
      expect(finalCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('should only show clear filters button when filters are active', async ({
      page,
    }) => {
      // given
      await leadsPage.navigateToLeads();
      await leadsPage.waitForLeadsToLoad();

      // then - no clear button initially
      const clearButton = page.locator('button:has-text("Clear All")');
      await expect(clearButton).not.toBeVisible();

      // when - apply a filter
      await leadsPage.searchLeads('test');

      // then - clear button should appear
      await expect(clearButton).toBeVisible();

      // when - clear filters
      await leadsPage.clearFilters();

      // then - clear button should disappear
      await expect(clearButton).not.toBeVisible();
    });
  });
});
