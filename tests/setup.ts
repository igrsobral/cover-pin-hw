/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from '@playwright/test';

import { MockApi } from './utils/mock-api';
import { TestHelpers } from './utils/test-helpers';

export const test = base.extend<{
  testHelpers: TestHelpers;
  mockApi: MockApi;
}>({
  // eslint-disable-next-line no-empty-pattern
  testHelpers: async ({}, use) => {
    const testHelpers = new TestHelpers();
    await use(testHelpers);
  },

  mockApi: async ({ page }, use) => {
    const mockApi = new MockApi(page);
    await use(mockApi);
  },
});

export { expect };
