import { Page, Locator } from '@playwright/test';

/**
 * Base Page class containing common functionality for all pages
 */
export class BasePage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for page to be loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Open the hamburger menu
   */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.page.waitForTimeout(500); // Wait for menu animation
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  /**
   * Get the cart item count
   */
  async getCartItemCount(): Promise<number> {
    try {
      const cartText = await this.cartBadge.textContent();
      return cartText ? parseInt(cartText, 10) : 0;
    } catch {
      return 0; // No items in cart
    }
  }

  /**
   * Navigate to shopping cart
   */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Take a screenshot with a custom name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}