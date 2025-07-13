import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Shopping Cart Page Object Model
 */
export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartList: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.removeButtons = page.locator('[data-test*="remove"]');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
    this.cartList = page.locator('.cart_list');
  }

  /**
   * Check if cart page is displayed
   */
  async isCartPageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle);
      const title = await this.pageTitle.textContent();
      return title === 'Your Cart';
    } catch {
      return false;
    }
  }

  /**
   * Get all items in cart
   */
  async getCartItems(): Promise<Array<{ name: string; price: string; quantity: string }>> {
    await this.waitForElement(this.cartList);
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
   * Get cart item names
   */
  async getCartItemNames(): Promise<string[]> {
    if (await this.isCartEmpty()) {
      return [];
    }
    return await this.cartItemNames.allTextContents();
  }

  /**
   * Remove item from cart by name
   */
  async removeItemFromCart(itemName: string): Promise<void> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    const removeButton = item.locator('[data-test*="remove"]');
    await removeButton.click();
  }

  /**
   * Remove all items from cart
   */
  async removeAllItemsFromCart(): Promise<void> {
    const removeButtons = await this.removeButtons.all();
    
    for (const button of removeButtons) {
      await button.click();
      await this.page.waitForTimeout(500); // Wait between removals
    }
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    try {
      const itemCount = await this.cartItems.count();
      return itemCount === 0;
    } catch {
      return true;
    }
  }

  /**
   * Get total number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    if (await this.isCartEmpty()) {
      return 0;
    }
    return await this.cartItems.count();
  }

  /**
   * Verify specific item is in cart
   */
  async isItemInCart(itemName: string): Promise<boolean> {
    if (await this.isCartEmpty()) {
      return false;
    }
    
    const cartItemNames = await this.getCartItemNames();
    return cartItemNames.includes(itemName);
  }

  /**
   * Get item details by name
   */
  async getItemDetails(itemName: string): Promise<{ name: string; price: string; quantity: string } | null> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    
    if (!(await item.isVisible())) {
      return null;
    }
    
    const name = await item.locator('.inventory_item_name').textContent() || '';
    const price = await item.locator('.inventory_item_price').textContent() || '';
    const quantity = await item.locator('.cart_quantity').textContent() || '';
    
    return { name, price, quantity };
  }

  /**
   * Calculate total price of items in cart
   */
  async calculateTotalPrice(): Promise<number> {
    const items = await this.getCartItems();
    let total = 0;
    
    for (const item of items) {
      const price = parseFloat(item.price.replace('$', ''));
      const quantity = parseInt(item.quantity, 10);
      total += price * quantity;
    }
    
    return parseFloat(total.toFixed(2));
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }
}