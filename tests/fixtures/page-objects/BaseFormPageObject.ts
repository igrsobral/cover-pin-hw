import { BasePageObject, type PageObjectOptions } from './BasePageObject';

import type { Page } from '@playwright/test';

export interface FormField {
  selector: string;
  type: 'input' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  validation?: RegExp;
}

export abstract class BaseFormPageObject extends BasePageObject {
  protected abstract formSelector: string;
  protected abstract submitButtonSelector: string;
  protected abstract cancelButtonSelector?: string;
  protected abstract fields: Record<string, FormField>;

  constructor(page: Page, options?: PageObjectOptions) {
    super(page, options);
  }

  // Form interaction methods
  async waitForFormToLoad(): Promise<void> {
    await this.expectElementToBeVisible(this.formSelector);
    await this.waitForLoadingToComplete();
  }

  async fillForm(
    data: Record<string, string | number | boolean>
  ): Promise<void> {
    await this.waitForFormToLoad();

    for (const [fieldName, value] of Object.entries(data)) {
      if (this.fields[fieldName] && value !== undefined) {
        await this.fillField(fieldName, value);
      }
    }
  }

  async fillField(
    fieldName: string,
    value: string | number | boolean
  ): Promise<void> {
    const field = this.fields[fieldName];
    if (!field) {
      throw new Error(`Field ${fieldName} not found in form definition`);
    }

    const selector = field.selector;

    try {
      switch (field.type) {
        case 'input':
        case 'textarea':
          await this.fillInput(selector, String(value));
          break;
        case 'select':
          await this.selectOption(selector, String(value));
          break;
        case 'checkbox': {
          const isChecked = await this.page.locator(selector).isChecked();
          if ((value && !isChecked) || (!value && isChecked)) {
            await this.clickElement(selector);
          }
          break;
        }
        case 'radio':
          await this.clickElement(`${selector}[value="${value}"]`);
          break;
        default:
          throw new Error(`Unsupported field type: ${field.type}`);
      }
    } catch (error) {
      await this.handleError(error as Error, `fillField-${fieldName}`);
    }
  }

  async getFieldValue(fieldName: string): Promise<string> {
    const field = this.fields[fieldName];
    if (!field) {
      throw new Error(`Field ${fieldName} not found in form definition`);
    }

    const selector = field.selector;

    switch (field.type) {
      case 'input':
      case 'textarea':
        return await this.getElementValue(selector);
      case 'select':
        return await this.getElementValue(selector);
      case 'checkbox': {
        const isChecked = await this.page.locator(selector).isChecked();
        return isChecked.toString();
      }
      case 'radio': {
        const checkedRadio = await this.page
          .locator(`${selector}:checked`)
          .first();
        return (await checkedRadio.getAttribute('value')) || '';
      }
      default:
        return '';
    }
  }

  async clearField(fieldName: string): Promise<void> {
    const field = this.fields[fieldName];
    if (!field) {
      throw new Error(`Field ${fieldName} not found in form definition`);
    }

    const selector = field.selector;

    switch (field.type) {
      case 'input':
      case 'textarea':
        await this.fillInput(selector, '');
        break;
      case 'select': {
        const options = await this.page.locator(`${selector} option`).all();
        if (options.length > 0) {
          const firstValue = (await options[0].getAttribute('value')) || '';
          await this.selectOption(selector, firstValue);
        }
        break;
      }
      case 'checkbox': {
        const isChecked = await this.page.locator(selector).isChecked();
        if (isChecked) {
          await this.clickElement(selector);
        }
        break;
      }
    }
  }

  async clearForm(): Promise<void> {
    for (const fieldName of Object.keys(this.fields)) {
      await this.clearField(fieldName);
    }
  }

  // Form submission methods
  async submitForm(): Promise<void> {
    await this.clickElement(this.submitButtonSelector);
  }

  async cancelForm(): Promise<void> {
    if (this.cancelButtonSelector) {
      await this.clickElement(this.cancelButtonSelector);
    } else {
      throw new Error('Cancel button selector not defined');
    }
  }

  async submitAndWaitForResponse(expectedUrl?: string | RegExp): Promise<void> {
    await this.submitForm();

    if (expectedUrl) {
      await this.waitForUrl(expectedUrl);
    } else {
      await this.waitForLoadingToComplete();
    }
  }

  // Form validation methods
  async validateField(
    fieldName: string,
    expectedValue?: string | number | boolean
  ): Promise<boolean> {
    const field = this.fields[fieldName];
    if (!field) {
      return false;
    }

    try {
      // Check if field is visible and enabled
      await this.expectElementToBeVisible(field.selector);

      if (field.required) {
        await this.expectElementToHaveAttribute(field.selector, 'required', '');
      }

      if (expectedValue !== undefined) {
        const actualValue = await this.getFieldValue(fieldName);
        return actualValue === String(expectedValue);
      }

      return true;
    } catch {
      return false;
    }
  }

  async validateFormStructure(): Promise<boolean> {
    try {
      await this.expectElementToBeVisible(this.formSelector);
      await this.expectElementToBeVisible(this.submitButtonSelector);

      // Validate all defined fields exist
      for (const [, field] of Object.entries(this.fields)) {
        await this.expectElementToBeVisible(field.selector);
      }

      return true;
    } catch {
      return false;
    }
  }

  async getFormErrors(): Promise<string[]> {
    const errorSelectors = [
      '.error',
      '.field-error',
      '[data-testid*="error"]',
      '.invalid-feedback',
      '.form-error',
    ];

    const errors: string[] = [];

    for (const selector of errorSelectors) {
      try {
        const errorElements = await this.page.locator(selector).all();
        for (const element of errorElements) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();
            if (text && text.trim()) {
              errors.push(text.trim());
            }
          }
        }
      } catch {
        // Ignore if selector doesn't exist
      }
    }

    return errors;
  }

  async hasFormErrors(): Promise<boolean> {
    const errors = await this.getFormErrors();
    return errors.length > 0;
  }

  async waitForFormErrors(): Promise<void> {
    const errorSelectors = ['.error', '.field-error', '[data-testid*="error"]'];

    await Promise.race(
      errorSelectors.map((selector) =>
        this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 })
      )
    );
  }

  async validateFieldError(
    fieldName: string,
    expectedError?: string
  ): Promise<boolean> {
    const field = this.fields[fieldName];
    if (!field) {
      return false;
    }

    // Look for error near the field
    const fieldElement = this.page.locator(field.selector);
    const fieldContainer = fieldElement.locator('xpath=..');

    const errorSelectors = ['.error', '.field-error', '[data-testid*="error"]'];

    for (const errorSelector of errorSelectors) {
      try {
        const errorElement = fieldContainer.locator(errorSelector);
        const isVisible = await errorElement.isVisible();

        if (isVisible) {
          if (expectedError) {
            const errorText = await errorElement.textContent();
            return errorText?.includes(expectedError) || false;
          }
          return true;
        }
      } catch {
        // Continue to next selector
      }
    }

    return false;
  }

  // Form state methods
  async isFormValid(): Promise<boolean> {
    // Check if submit button is enabled (common pattern)
    try {
      const submitButton = this.page.locator(this.submitButtonSelector);
      return await submitButton.isEnabled();
    } catch {
      return false;
    }
  }

  async isFormDirty(): Promise<boolean> {
    // Check if form has unsaved changes
    // This is implementation-specific, but common patterns include:
    // - Checking for a "dirty" class or attribute
    // - Comparing current values with initial values

    try {
      const formElement = this.page.locator(this.formSelector);
      const isDirty = await formElement.getAttribute('data-dirty');
      return isDirty === 'true';
    } catch {
      return false;
    }
  }

  async getFormData(): Promise<Record<string, string | null>> {
    const formData: Record<string, string | null> = {};

    for (const fieldName of Object.keys(this.fields)) {
      try {
        formData[fieldName] = await this.getFieldValue(fieldName);
      } catch {
        formData[fieldName] = null;
      }
    }

    return formData;
  }

  // Accessibility validation
  async validateFormAccessibility(): Promise<boolean> {
    try {
      // Check form has proper labels
      for (const [fieldName, field] of Object.entries(this.fields)) {
        const fieldElement = this.page.locator(field.selector);

        // Check for label association
        const fieldId = await fieldElement.getAttribute('id');
        const ariaLabel = await fieldElement.getAttribute('aria-label');
        const ariaLabelledBy =
          await fieldElement.getAttribute('aria-labelledby');

        if (!fieldId && !ariaLabel && !ariaLabelledBy) {
          console.warn(`Field ${fieldName} lacks proper labeling`);
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }
}
