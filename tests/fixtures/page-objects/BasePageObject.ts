import { Page, Locator, expect, BrowserContext } from '@playwright/test';

export interface PageObjectOptions {
  timeout?: number;
  retries?: number;
  screenshotOnError?: boolean;
}

export abstract class BasePageObject {
  protected page: Page;
  protected context: BrowserContext;
  protected options: PageObjectOptions;

  constructor(page: Page, options: PageObjectOptions = {}) {
    this.page = page;
    this.context = page.context();
    this.options = {
      timeout: 30000,
      retries: 3,
      screenshotOnError: true,
      ...options,
    };
  }

  // Navigation methods
  async navigateTo(url: string): Promise<void> {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
    } catch (error) {
      await this.handleError(error as Error, `navigateTo-${url}`);
    }
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  // Element interaction methods
  async waitForSelector(
    selector: string,
    options?: {
      timeout?: number;
      state?: 'attached' | 'detached' | 'visible' | 'hidden';
    }
  ): Promise<Locator> {
    const timeout = options?.timeout || this.options.timeout;
    return this.page.waitForSelector(selector, { timeout, ...options });
  }

  async waitForLoadingToComplete(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    // Also wait for any loading spinners to disappear
    await this.waitForLoadingSpinnersToDisappear();
  }

  async waitForLoadingSpinnersToDisappear(): Promise<void> {
    const loadingSelectors = [
      '[data-testid="loading"]',
      '.loading',
      '.spinner',
      '[aria-label="Loading"]',
    ];

    for (const selector of loadingSelectors) {
      try {
        await this.page.waitForSelector(selector, {
          state: 'detached',
          timeout: 5000,
        });
      } catch {
        // Ignore if selector doesn't exist
      }
    }
  }

  async clickElement(
    selector: string,
    options?: { force?: boolean; timeout?: number }
  ): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({
        state: 'visible',
        timeout: options?.timeout || this.options.timeout,
      });
      await element.click({ force: options?.force });
    } catch (error) {
      await this.handleError(error as Error, `clickElement-${selector}`);
    }
  }

  async doubleClickElement(selector: string): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
      await element.dblclick();
    } catch (error) {
      await this.handleError(error as Error, `doubleClickElement-${selector}`);
    }
  }

  async hoverElement(selector: string): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
      await element.hover();
    } catch (error) {
      await this.handleError(error as Error, `hoverElement-${selector}`);
    }
  }

  async fillInput(
    selector: string,
    value: string,
    options?: { clear?: boolean }
  ): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });

      if (options?.clear !== false) {
        await element.clear();
      }

      await element.fill(value);
    } catch (error) {
      await this.handleError(error as Error, `fillInput-${selector}`);
    }
  }

  async selectOption(
    selector: string,
    value: string | string[]
  ): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
      await element.selectOption(value);
    } catch (error) {
      await this.handleError(error as Error, `selectOption-${selector}`);
    }
  }

  async uploadFile(selector: string, filePath: string): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.setInputFiles(filePath);
    } catch (error) {
      await this.handleError(error as Error, `uploadFile-${selector}`);
    }
  }

  // Assertion methods
  async expectElementToBeVisible(
    selector: string,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({
      timeout: timeout || this.options.timeout,
    });
  }

  async expectElementToBeHidden(
    selector: string,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden({
      timeout: timeout || this.options.timeout,
    });
  }

  async expectElementToHaveText(
    selector: string,
    text: string | RegExp,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text, {
      timeout: timeout || this.options.timeout,
    });
  }

  async expectElementToContainText(
    selector: string,
    text: string,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(text, {
      timeout: timeout || this.options.timeout,
    });
  }

  async expectElementToHaveValue(
    selector: string,
    value: string,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(value, {
      timeout: timeout || this.options.timeout,
    });
  }

  async expectElementToHaveAttribute(
    selector: string,
    attribute: string,
    value: string,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toHaveAttribute(
      attribute,
      value,
      { timeout: timeout || this.options.timeout }
    );
  }

  async expectElementToBeEnabled(
    selector: string,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled({
      timeout: timeout || this.options.timeout,
    });
  }

  async expectElementToBeDisabled(
    selector: string,
    timeout?: number
  ): Promise<void> {
    await expect(this.page.locator(selector)).toBeDisabled({
      timeout: timeout || this.options.timeout,
    });
  }

  // Utility methods
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  async getElementText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return (await element.textContent()) || '';
  }

  async getElementValue(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return await element.inputValue();
  }

  async getElementAttribute(
    selector: string,
    attribute: string
  ): Promise<string | null> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return await element.getAttribute(attribute);
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  async isElementEnabled(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isEnabled();
    } catch {
      return false;
    }
  }

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async waitForUrl(url: string | RegExp, timeout?: number): Promise<void> {
    await this.page.waitForURL(url, {
      timeout: timeout || this.options.timeout,
    });
  }

  async waitForResponse(
    urlPattern: string | RegExp,
    timeout?: number
  ): Promise<void> {
    await this.page.waitForResponse(urlPattern, {
      timeout: timeout || this.options.timeout,
    });
  }

  // Screenshot and debugging methods
  async takeScreenshot(
    name: string,
    options?: {
      fullPage?: boolean;
      clip?: { x: number; y: number; width: number; height: number };
    }
  ): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;

    await this.page.screenshot({
      path: filename,
      fullPage: options?.fullPage !== false,
      clip: options?.clip,
    });
  }

  async takeElementScreenshot(selector: string, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-element-${timestamp}.png`;

    const element = this.page.locator(selector);
    await element.screenshot({ path: filename });
  }

  async recordVideo(name: string): Promise<void> {
    // Video recording is configured at the browser context level
    console.log(
      `Video recording for ${name} - configured in playwright.config.ts`
    );
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Error handling and retry logic
  async handleError(error: Error, context: string): Promise<void> {
    console.error(`Error in ${context}:`, error.message);

    if (this.options.screenshotOnError) {
      await this.takeScreenshot(`error-${context}`);
    }

    // Log additional debugging information
    console.log(`Current URL: ${this.page.url()}`);
    console.log(`Page title: ${await this.page.title()}`);

    throw error;
  }

  async retryAction<T>(action: () => Promise<T>, context: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= (this.options.retries || 3); attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed for ${context}:`, error);

        if (attempt < (this.options.retries || 3)) {
          await this.waitForTimeout(1000 * attempt); // Exponential backoff
        }
      }
    }

    if (lastError) {
      await this.handleError(lastError, `retryAction-${context}`);
    }

    throw new Error(`All retry attempts failed for ${context}`);
  }

  // Keyboard and mouse actions
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async typeText(text: string, delay?: number): Promise<void> {
    await this.page.keyboard.type(text, { delay });
  }

  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
  }

  // Mobile-specific methods
  async swipe(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Promise<void> {
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();
  }

  async pinchZoom(
    centerX: number,
    centerY: number,
    scale: number
  ): Promise<void> {
    await this.page.touchscreen.tap(centerX, centerY);
    // Note: Playwright doesn't have built-in pinch zoom, this is a placeholder
    console.log(
      `Pinch zoom gesture at (${centerX}, ${centerY}) with scale ${scale}`
    );
  }

  // Performance monitoring
  async measureLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.waitForLoadingToComplete();
    return Date.now() - startTime;
  }

  async measureActionTime<T>(
    action: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await action();
    const duration = Date.now() - startTime;
    return { result, duration };
  }
}
