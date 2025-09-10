import { Page } from '@playwright/test';

import { BasePageObject, PageObjectOptions } from './BasePageObject';

export abstract class BaseModalPageObject extends BasePageObject {
  protected abstract modalSelector: string;
  protected abstract modalOverlaySelector: string;
  protected abstract closeButtonSelector: string;
  protected abstract modalTitleSelector?: string;
  protected abstract modalContentSelector?: string;

  constructor(page: Page, options?: PageObjectOptions) {
    super(page, options);
  }

  // Modal visibility methods
  async waitForModalToOpen(): Promise<void> {
    await this.expectElementToBeVisible(this.modalSelector);
    await this.expectElementToBeVisible(this.modalOverlaySelector);

    // Wait for any opening animations to complete
    await this.waitForTimeout(300);
  }

  async waitForModalToClose(): Promise<void> {
    await this.expectElementToBeHidden(this.modalSelector);
    await this.expectElementToBeHidden(this.modalOverlaySelector);
  }

  async isModalOpen(): Promise<boolean> {
    return await this.isElementVisible(this.modalSelector);
  }

  async isModalClosed(): Promise<boolean> {
    return !(await this.isModalOpen());
  }

  // Modal interaction methods
  async openModal(triggerSelector?: string): Promise<void> {
    if (triggerSelector) {
      await this.clickElement(triggerSelector);
    }
    await this.waitForModalToOpen();
  }

  async closeModal(): Promise<void> {
    await this.clickElement(this.closeButtonSelector);
    await this.waitForModalToClose();
  }

  async closeModalByOverlay(): Promise<void> {
    // Click on the overlay (outside the modal content)
    const overlay = this.page.locator(this.modalOverlaySelector);
    const modalContent = this.page.locator(
      this.modalContentSelector || this.modalSelector
    );

    // Get the bounding boxes
    const overlayBox = await overlay.boundingBox();
    const contentBox = await modalContent.boundingBox();

    if (overlayBox && contentBox) {
      // Click outside the modal content
      const clickX = overlayBox.x + 10;
      const clickY = overlayBox.y + 10;

      await this.page.mouse.click(clickX, clickY);
      await this.waitForModalToClose();
    }
  }

  async closeModalByEscape(): Promise<void> {
    await this.pressKey('Escape');
    await this.waitForModalToClose();
  }

  // Modal content methods
  async getModalTitle(): Promise<string> {
    if (!this.modalTitleSelector) {
      throw new Error('Modal title selector not defined');
    }

    await this.waitForModalToOpen();
    return await this.getElementText(this.modalTitleSelector);
  }

  async getModalContent(): Promise<string> {
    if (!this.modalContentSelector) {
      throw new Error('Modal content selector not defined');
    }

    await this.waitForModalToOpen();
    return await this.getElementText(this.modalContentSelector);
  }

  async expectModalTitle(expectedTitle: string): Promise<void> {
    if (!this.modalTitleSelector) {
      throw new Error('Modal title selector not defined');
    }

    await this.expectElementToHaveText(this.modalTitleSelector, expectedTitle);
  }

  async expectModalContent(expectedContent: string): Promise<void> {
    if (!this.modalContentSelector) {
      throw new Error('Modal content selector not defined');
    }

    await this.expectElementToContainText(
      this.modalContentSelector,
      expectedContent
    );
  }

  // Modal state validation
  async validateModalStructure(): Promise<boolean> {
    try {
      await this.waitForModalToOpen();

      // Check required elements exist
      await this.expectElementToBeVisible(this.modalSelector);
      await this.expectElementToBeVisible(this.modalOverlaySelector);
      await this.expectElementToBeVisible(this.closeButtonSelector);

      if (this.modalTitleSelector) {
        await this.expectElementToBeVisible(this.modalTitleSelector);
      }

      if (this.modalContentSelector) {
        await this.expectElementToBeVisible(this.modalContentSelector);
      }

      return true;
    } catch {
      return false;
    }
  }

  async validateModalAccessibility(): Promise<boolean> {
    try {
      await this.waitForModalToOpen();

      const modal = this.page.locator(this.modalSelector);

      // Check for proper ARIA attributes
      const role = await modal.getAttribute('role');
      const ariaModal = await modal.getAttribute('aria-modal');
      const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
      const ariaLabel = await modal.getAttribute('aria-label');

      // Modal should have role="dialog" and aria-modal="true"
      if (role !== 'dialog' && role !== 'alertdialog') {
        console.warn('Modal missing proper role attribute');
        return false;
      }

      if (ariaModal !== 'true') {
        console.warn('Modal missing aria-modal="true"');
        return false;
      }

      // Modal should be labeled
      if (!ariaLabelledBy && !ariaLabel) {
        console.warn('Modal missing proper labeling');
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // Focus management
  async validateFocusManagement(): Promise<boolean> {
    try {
      await this.waitForModalToOpen();

      // Check if focus is trapped within the modal
      const modal = this.page.locator(this.modalSelector);
      const focusableElements = await modal
        .locator(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        .all();

      if (focusableElements.length === 0) {
        console.warn('Modal has no focusable elements');
        return false;
      }

      // Check if first focusable element is focused
      const firstFocusable = focusableElements[0];
      const isFocused = await firstFocusable.evaluate(
        (el) => document.activeElement === el
      );

      if (!isFocused) {
        console.warn('First focusable element is not focused');
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // Animation and timing
  async waitForModalAnimation(): Promise<void> {
    // Wait for CSS animations/transitions to complete
    await this.waitForTimeout(500);

    // Check if modal has finished animating
    const modal = this.page.locator(this.modalSelector);
    await modal.evaluate((el) => {
      return new Promise((resolve) => {
        const checkAnimations = () => {
          const animations = el.getAnimations();
          if (animations.length === 0) {
            resolve(undefined);
          } else {
            setTimeout(checkAnimations, 50);
          }
        };
        checkAnimations();
      });
    });
  }

  // Modal backdrop and overlay
  async validateModalBackdrop(): Promise<boolean> {
    try {
      await this.waitForModalToOpen();

      const overlay = this.page.locator(this.modalOverlaySelector);

      // Check overlay covers the entire viewport
      const overlayBox = await overlay.boundingBox();
      const viewportSize = this.page.viewportSize();

      if (!overlayBox || !viewportSize) {
        return false;
      }

      // Overlay should cover most of the viewport
      const coverageThreshold = 0.9;
      const overlayCoverage =
        (overlayBox.width * overlayBox.height) /
        (viewportSize.width * viewportSize.height);

      return overlayCoverage >= coverageThreshold;
    } catch {
      return false;
    }
  }

  // Modal positioning
  async validateModalCentering(): Promise<boolean> {
    try {
      await this.waitForModalToOpen();

      const modal = this.page.locator(this.modalSelector);
      const modalBox = await modal.boundingBox();
      const viewportSize = this.page.viewportSize();

      if (!modalBox || !viewportSize) {
        return false;
      }

      // Check if modal is roughly centered
      const centerX = viewportSize.width / 2;
      const centerY = viewportSize.height / 2;
      const modalCenterX = modalBox.x + modalBox.width / 2;
      const modalCenterY = modalBox.y + modalBox.height / 2;

      const tolerance = 50; // pixels
      const isCenteredX = Math.abs(centerX - modalCenterX) <= tolerance;
      const isCenteredY = Math.abs(centerY - modalCenterY) <= tolerance;

      return isCenteredX && isCenteredY;
    } catch {
      return false;
    }
  }

  // Responsive behavior
  async validateResponsiveModal(): Promise<boolean> {
    try {
      await this.waitForModalToOpen();

      const modal = this.page.locator(this.modalSelector);
      const modalBox = await modal.boundingBox();
      const viewportSize = this.page.viewportSize();

      if (!modalBox || !viewportSize) {
        return false;
      }

      // On small screens, modal should adapt
      if (viewportSize.width < 768) {
        // Mobile: modal should be close to full width
        const widthRatio = modalBox.width / viewportSize.width;
        return widthRatio >= 0.8;
      } else {
        // Desktop: modal should not be full width
        const widthRatio = modalBox.width / viewportSize.width;
        return widthRatio <= 0.8;
      }
    } catch {
      return false;
    }
  }
}
