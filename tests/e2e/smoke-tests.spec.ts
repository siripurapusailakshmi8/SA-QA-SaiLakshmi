import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PRODUCTS } from '../data/testData';

test.describe('Smoke Tests - Critical Path Validation', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('Application loads and login page is accessible', async ({ page }) => {
    await test.step('Navigate to application', async () => {
      await loginPage.navigate();

      // Verify page loads
      expect(await loginPage.getTitle()).toBe('Swag Labs');

      // Verify login form is visible
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);

      // Verify logo is displayed
      expect(await loginPage.isLogoVisible()).toBe(true);
    });
  });

  test('Standard user can login successfully', async ({ page }) => {
    await test.step('Login with valid credentials', async () => {
      await loginPage.navigate();
      await loginPage.loginAsStandardUser();

      // Verify successful login
      await expect(page).toHaveURL(/.*inventory/);
      expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);
      expect(await inventoryPage.getPageTitle()).toBe('Products');
    });
  });

  test('Product inventory loads with items', async ({ page }) => {
    await test.step('Verify product catalog is functional', async () => {
      await loginPage.navigate();
      await loginPage.loginAsStandardUser();

      // Verify products are displayed
      const productCount = await inventoryPage.getInventoryItemCount();
      expect(productCount).toBeGreaterThan(0);

      // Verify product names are loaded
      const productNames = await inventoryPage.getProductNames();
      expect(productNames.length).toBeGreaterThan(0);
      expect(productNames[0]).toBeTruthy();

      // Verify product prices are displayed
      const productPrices = await inventoryPage.getProductPrices();
      expect(productPrices.length).toBeGreaterThan(0);
      expect(productPrices[0]).toContain('$');
    });
  });

  test('Add to cart functionality works', async ({ page }) => {
    await test.step('Verify cart functionality', async () => {
      await loginPage.navigate();
      await loginPage.loginAsStandardUser();

      // Add item to cart
      const productName = await inventoryPage.addFirstProductToCart();

      // Verify cart badge appears
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);

      // Verify button changes to "Remove"
      const isInCart = await inventoryPage.isProductInCart(productName);
      expect(isInCart).toBe(true);
    });
  });

  test('Cart page displays added items', async ({ page }) => {
    await test.step('Verify cart page functionality', async () => {
      await loginPage.navigate();
      await loginPage.loginAsStandardUser();

      // Add item and navigate to cart
      const productName = await inventoryPage.addFirstProductToCart();
      await inventoryPage.goToCart();

      // Verify cart page loads
      expect(await cartPage.isCartPageDisplayed()).toBe(true);

      // Verify item is in cart
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toContain(productName);

      // Verify checkout button is present
      const checkoutButton = cartPage.checkoutButton;
      expect(await checkoutButton.isVisible()).toBe(true);
    });
  });

  test('Checkout information page is accessible', async ({ page }) => {
    await test.step('Verify checkout process starts', async () => {
      await loginPage.navigate();
      await loginPage.loginAsStandardUser();

      // Add item and proceed to checkout
      await inventoryPage.addFirstProductToCart();
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();

      // Verify checkout information page loads
      await expect(page).toHaveURL(/.*checkout-step-one/);
      expect(await checkoutPage.isCheckoutInformationPageDisplayed()).toBe(true);

      // Verify form fields are present
      expect(await checkoutPage.firstNameInput.isVisible()).toBe(true);
      expect(await checkoutPage.lastNameInput.isVisible()).toBe(true);
      expect(await checkoutPage.postalCodeInput.isVisible()).toBe(true);
    });
  });

  test('Logout functionality works', async ({ page }) => {
    await test.step('Verify logout process', async () => {
      await loginPage.navigate();
      await loginPage.loginAsStandardUser();

      // Perform logout
      await inventoryPage.logout();

      // Verify return to login page
      await expect(page).toHaveURL(/.*\/$/);
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    });
  });

  test('Locked out user cannot access application', async ({ page }) => {
    await test.step('Verify security controls work', async () => {
      await loginPage.navigate();
      await loginPage.loginAsLockedOutUser();

      // Verify error message is shown
      expect(await loginPage.isErrorMessageDisplayed()).toBe(true);

      // Verify user remains on login page
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(page.url()).not.toContain('inventory');
    });
  });

  test('Cross-browser compatibility check', async ({ page, browserName }) => {
    await test.step(`Verify basic functionality on ${browserName}`, async () => {
      await loginPage.navigate();

      // Verify page loads correctly across browsers
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);

      // Verify login works
      await loginPage.loginAsStandardUser();
      expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);

      // Verify basic interaction
      await inventoryPage.addFirstProductToCart();
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);

      console.log(`✅ Smoke test passed on ${browserName}`);
    });
  });

  test('Performance check - page load times', async ({ page }) => {
    await test.step('Verify reasonable load times', async () => {
      const startTime = Date.now();

      await loginPage.navigate();
      await loginPage.loginAsStandardUser();

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Verify login and page load completes within reasonable time (10 seconds)
      expect(loadTime).toBeLessThan(10000);

      console.log(`📊 Login and inventory load time: ${loadTime}ms`);
    });
  });
});