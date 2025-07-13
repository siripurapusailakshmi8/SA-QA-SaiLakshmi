import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Inventory Page Object Model
 */
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('.product_sort_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.addToCartButtons = page.locator('[data-test*="add-to-cart"]');
    this.removeButtons = page.locator('[data-test*="remove"]');
  }

  /**
   * Check if inventory page is displayed
   */
  async isInventoryPageDisplayed(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle);
      const title = await this.pageTitle.textContent();
      return title === 'Products';
    } catch {
      return false;
    }
  }

  /**
   * Get all product names
   */
  async getProductNames(): Promise<string[]> {
    await this.waitForElement(this.productNames.first());
    return await this.productNames.allTextContents();
  }

  /**
   * Get all product prices
   */
  async getProductPrices(): Promise<string[]> {
    await this.waitForElement(this.productPrices.first());
    return await this.productPrices.allTextContents();
  }

  /**
   * Add a specific product to cart by name
   */
  async addProductToCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item', { hasText: productName });
    const addButton = product.locator('[data-test*="add-to-cart"]');
    await addButton.click();
  }

  /**
   * Add the first product to cart
   */
  async addFirstProductToCart(): Promise<string> {
    const firstProduct = this.inventoryItems.first();
    const productName = await firstProduct.locator('.inventory_item_name').textContent() || '';
    const addButton = firstProduct.locator('[data-test*="add-to-cart"]');
    await addButton.click();
    return productName;
  }

  /**
   * Add multiple products to cart by index
   */
  async addMultipleProductsToCart(indices: number[]): Promise<string[]> {
    const addedProducts: string[] = [];
    
    for (const index of indices) {
      const product = this.inventoryItems.nth(index);
      const productName = await product.locator('.inventory_item_name').textContent() || '';
      const addButton = product.locator('[data-test*="add-to-cart"]');
      await addButton.click();
      addedProducts.push(productName);
    }
    
    return addedProducts;
  }

  /**
   * Remove a product from cart by name
   */
  async removeProductFromCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item', { hasText: productName });
    const removeButton = product.locator('[data-test*="remove"]');
    await removeButton.click();
  }

  /**
   * Sort products by option
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
    await this.page.waitForTimeout(1000); // Wait for sort to complete
  }

  /**
   * Get product details by name
   */
  async getProductDetails(productName: string): Promise<{ name: string; price: string; description: string }> {
    const product = this.page.locator('.inventory_item', { hasText: productName });
    const name = await product.locator('.inventory_item_name').textContent() || '';
    const price = await product.locator('.inventory_item_price').textContent() || '';
    const description = await product.locator('.inventory_item_desc').textContent() || '';
    
    return { name, price, description };
  }

  /**
   * Click on product name to view details
   */
  async clickProductName(productName: string): Promise<void> {
    const productLink = this.page.locator('.inventory_item_name', { hasText: productName });
    await productLink.click();
  }

  /**
   * Get count of items in inventory
   */
  async getInventoryItemCount(): Promise<number> {
    await this.waitForElement(this.inventoryItems.first());
    return await this.inventoryItems.count();
  }

  /**
   * Check if a product is added to cart (button shows "Remove")
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const product = this.page.locator('.inventory_item', { hasText: productName });
    const removeButton = product.locator('[data-test*="remove"]');
    return await removeButton.isVisible();
  }

  /**
   * Get page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }
}