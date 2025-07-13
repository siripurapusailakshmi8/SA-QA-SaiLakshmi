import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Pages Object Model
 * Handles both checkout steps: information entry and overview
 */
export class CheckoutPage extends BasePage {
  // Step 1: Information form
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2: Overview page
  readonly overviewTitle: Locator;
  readonly cartItems: Locator;
  readonly itemTotal: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;

  // Step 3: Completion page
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Step 1 elements
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2 elements
    this.overviewTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('#finish');
    this.paymentInfo = page.locator('.summary_value_label').first();
    this.shippingInfo = page.locator('.summary_value_label').nth(1);

    // Step 3 elements
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('#back-to-products');
  }

  /**
   * Fill checkout information form
   */
  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Continue to next step after filling information
   */
  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Complete the checkout information step
   */
  async completeInformationStep(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.continueToOverview();
  }

  /**
   * Check if checkout information page is displayed
   */
  async isCheckoutInformationPageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle);
      const title = await this.pageTitle.textContent();
      return title === 'Checkout: Your Information';
    } catch {
      return false;
    }
  }

  /**
   * Check if checkout overview page is displayed
   */
  async isCheckoutOverviewPageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElement(this.overviewTitle);
      const title = await this.overviewTitle.textContent();
      return title === 'Checkout: Overview';
    } catch {
      return false;
    }
  }

  /**
   * Check if checkout complete page is displayed
   */
  async isCheckoutCompletePageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElement(this.completeHeader);
      return await this.completeHeader.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get items in checkout overview
   */
  async getOverviewItems(): Promise<Array<{ name: string; price: string; quantity: string }>> {
    await this.waitForElement(this.cartItems.first());
    const items: Array<{ name: string; price: string; quantity: string }> = [];
    
    const itemCount = await this.cartItems.count();
    
    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(i);
      const name = await item.locator('.inventory_item_name').textContent() || '';
      const price = await item.locator('.inventory_item_price').textContent() || '';
      const quantity = await item.locator('.cart_quantity').textContent() || '';
      
      items.push({ name, price, quantity });
    }
    
    return items;
  }

  /**
   * Get payment information text
   */
  async getPaymentInfo(): Promise<string> {
    return await this.paymentInfo.textContent() || '';
  }

  /**
   * Get shipping information text
   */
  async getShippingInfo(): Promise<string> {
    return await this.shippingInfo.textContent() || '';
  }

  /**
   * Get item total amount
   */
  async getItemTotal(): Promise<string> {
    return await this.itemTotal.textContent() || '';
  }

  /**
   * Get tax amount
   */
  async getTaxAmount(): Promise<string> {
    return await this.taxLabel.textContent() || '';
  }

  /**
   * Get total amount
   */
  async getTotalAmount(): Promise<string> {
    return await this.totalLabel.textContent() || '';
  }

  /**
   * Finish the order
   */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Cancel checkout and return to cart
   */
  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Get error message if validation fails
   */
  async getErrorMessage(): Promise<string> {
    try {
      await this.waitForElement(this.errorMessage, 3000);
      return await this.errorMessage.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElement(this.errorMessage, 3000);
      return await this.errorMessage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get completion message
   */
  async getCompletionMessage(): Promise<{ header: string; text: string }> {
    const header = await this.completeHeader.textContent() || '';
    const text = await this.completeText.textContent() || '';
    return { header, text };
  }

  /**
   * Return to products page from completion page
   */
  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }

  /**
   * Calculate expected totals from overview items
   */
  async calculateExpectedTotals(): Promise<{ itemTotal: number; tax: number; total: number }> {
    const items = await this.getOverviewItems();
    let itemTotal = 0;
    
    for (const item of items) {
      const price = parseFloat(item.price.replace('$', ''));
      const quantity = parseInt(item.quantity, 10);
      itemTotal += price * quantity;
    }
    
    // Tax rate is typically 8% in the demo application
    const tax = parseFloat((itemTotal * 0.08).toFixed(2));
    const total = parseFloat((itemTotal + tax).toFixed(2));
    
    return { itemTotal, tax, total };
  }

  /**
   * Verify checkout overview calculations
   */
  async verifyCheckoutCalculations(): Promise<boolean> {
    const expected = await this.calculateExpectedTotals();
    
    const itemTotalText = await this.getItemTotal();
    const taxText = await this.getTaxAmount();
    const totalText = await this.getTotalAmount();
    
    const actualItemTotal = parseFloat(itemTotalText.replace(/[^0-9.]/g, ''));
    const actualTax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const actualTotal = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    
    return expected.itemTotal === actualItemTotal &&
           expected.tax === actualTax &&
           expected.total === actualTotal;
  }
}