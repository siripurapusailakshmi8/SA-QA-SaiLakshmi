import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFORMATION, ERROR_MESSAGES } from '../data/testData';

test.describe('Negative Test Cases', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.navigate();
    });

    test.describe('Login Negative Tests', () => {
        test('Login with locked out user shows error message', async ({ page }) => {
            await test.step('Attempt login with locked out user', async () => {
                await loginPage.loginAsLockedOutUser();

                // Verify error message is displayed
                const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                // Verify specific error message
                const errorMessage = await loginPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.LOCKED_OUT_USER);

                // Verify user remains on login page
                expect(await loginPage.isLoginPageDisplayed()).toBe(true);

                // Verify URL hasn't changed
                expect(page.url()).toContain('/');
                expect(page.url()).not.toContain('inventory');
            });
        });

        test('Login with invalid credentials shows error', async ({ page }) => {
            await test.step('Attempt login with invalid credentials', async () => {
                await loginPage.login(USERS.INVALID.username, USERS.INVALID.password);

                const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await loginPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);

                expect(await loginPage.isLoginPageDisplayed()).toBe(true);
            });
        });

        test('Login with empty username shows error', async ({ page }) => {
            await test.step('Attempt login with empty username', async () => {
                await loginPage.login('', USERS.STANDARD.password);

                const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await loginPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_USERNAME);
            });
        });

        test('Login with empty password shows error', async ({ page }) => {
            await test.step('Attempt login with empty password', async () => {
                await loginPage.login(USERS.STANDARD.username, '');

                const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await loginPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_PASSWORD);
            });
        });

        test('Login with both fields empty shows username error', async ({ page }) => {
            await test.step('Attempt login with both fields empty', async () => {
                await loginPage.login('', '');

                const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await loginPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_USERNAME);
            });
        });
    });

    test.describe('Checkout Validation Tests', () => {
        test.beforeEach(async ({ page }) => {
            // Login and add item to cart for checkout tests
            await loginPage.loginAsStandardUser();
            await inventoryPage.addFirstProductToCart();
            await inventoryPage.goToCart();
            await cartPage.proceedToCheckout();
        });

        test('Checkout with empty first name shows error', async ({ page }) => {
            await test.step('Attempt checkout with empty first name', async () => {
                await checkoutPage.fillCheckoutInformation(
                    '', // empty first name
                    CHECKOUT_INFORMATION.VALID.lastName,
                    CHECKOUT_INFORMATION.VALID.postalCode
                );
                await checkoutPage.continueToOverview();

                const isErrorDisplayed = await checkoutPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await checkoutPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_FIRST_NAME);

                // Verify user remains on information page
                expect(await checkoutPage.isCheckoutInformationPageDisplayed()).toBe(true);
            });
        });

        test('Checkout with empty last name shows error', async ({ page }) => {
            await test.step('Attempt checkout with empty last name', async () => {
                await checkoutPage.fillCheckoutInformation(
                    CHECKOUT_INFORMATION.VALID.firstName,
                    '', // empty last name
                    CHECKOUT_INFORMATION.VALID.postalCode
                );
                await checkoutPage.continueToOverview();

                const isErrorDisplayed = await checkoutPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await checkoutPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_LAST_NAME);
            });
        });

        test('Checkout with empty postal code shows error', async ({ page }) => {
            await test.step('Attempt checkout with empty postal code', async () => {
                await checkoutPage.fillCheckoutInformation(
                    CHECKOUT_INFORMATION.VALID.firstName,
                    CHECKOUT_INFORMATION.VALID.lastName,
                    '' // empty postal code
                );
                await checkoutPage.continueToOverview();

                const isErrorDisplayed = await checkoutPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await checkoutPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_POSTAL_CODE);
            });
        });

        test('Checkout with all fields empty shows first name error', async ({ page }) => {
            await test.step('Attempt checkout with all fields empty', async () => {
                await checkoutPage.fillCheckoutInformation('', '', '');
                await checkoutPage.continueToOverview();

                const isErrorDisplayed = await checkoutPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                const errorMessage = await checkoutPage.getErrorMessage();
                expect(errorMessage).toBe(ERROR_MESSAGES.MISSING_FIRST_NAME);
            });
        });
    });

    test.describe('Cart Management Tests', () => {
        test.beforeEach(async ({ page }) => {
            await loginPage.loginAsStandardUser();
        });

        test('Proceed to checkout with empty cart', async ({ page }) => {
            await test.step('Try to checkout with empty cart', async () => {
                // Go directly to cart without adding items
                await inventoryPage.goToCart();

                // Verify cart is empty
                const isEmpty = await cartPage.isCartEmpty();
                expect(isEmpty).toBe(true);

                // The checkout button should be present but we'll see what happens
                // This might be a potential bug if it allows empty cart checkout
                try {
                    await cartPage.proceedToCheckout();
                    // If this succeeds, it might be a bug that should be reported
                    const isOnCheckout = await checkoutPage.isCheckoutInformationPageDisplayed();
                    if (isOnCheckout) {
                        console.log('POTENTIAL BUG: Empty cart checkout is allowed');
                    }
                } catch (error) {
                    // Expected behavior - checkout should not be allowed with empty cart
                    console.log('Expected: Checkout prevented with empty cart');
                }
            });
        });

        test('Remove all items from cart during checkout process', async ({ page }) => {
            await test.step('Add items and remove during checkout', async () => {
                // Add item to cart
                const selectedProduct = await inventoryPage.addFirstProductToCart();

                // Go to cart
                await inventoryPage.goToCart();

                // Verify item is in cart
                const isInCart = await cartPage.isItemInCart(selectedProduct);
                expect(isInCart).toBe(true);

                // Remove item from cart
                await cartPage.removeItemFromCart(selectedProduct);

                // Verify cart is now empty
                const isEmpty = await cartPage.isCartEmpty();
                expect(isEmpty).toBe(true);

                // Verify cart count is 0
                const cartCount = await cartPage.getCartItemCount();
                expect(cartCount).toBe(0);
            });
        });
    });

    test.describe('Session and State Tests', () => {
        test('Direct URL access without login redirects to login', async ({ page }) => {
            await test.step('Access inventory page without login', async () => {
                // Try to access inventory page directly
                await page.goto('/inventory.html');

                // Should be redirected back to login page
                await page.waitForURL(/.*\/$/, { timeout: 5000 });
                expect(await loginPage.isLoginPageDisplayed()).toBe(true);
            });
        });

        test('Direct access to checkout without cart items', async ({ page }) => {
            await test.step('Access checkout page without items', async () => {
                // Login first
                await loginPage.loginAsStandardUser();

                // Try to access checkout directly without items in cart
                await page.goto('/checkout-step-one.html');

                // Should either redirect to cart or allow but show empty state
                // This behavior needs to be verified against requirements
                const currentUrl = page.url();
                console.log(`Direct checkout access result: ${currentUrl}`);
            });
        });
    });

    test.describe('Browser Compatibility Tests', () => {
        test('Verify form validation works across browsers', async ({ page, browserName }) => {
            await test.step(`Test form validation on ${browserName}`, async () => {
                await loginPage.loginAsStandardUser();
                await inventoryPage.addFirstProductToCart();
                await inventoryPage.goToCart();
                await cartPage.proceedToCheckout();

                // Test empty form submission
                await checkoutPage.continueToOverview();

                const isErrorDisplayed = await checkoutPage.isErrorMessageDisplayed();
                expect(isErrorDisplayed).toBe(true);

                // Verify error handling is consistent across browsers
                const errorMessage = await checkoutPage.getErrorMessage();
                expect(errorMessage).toBeTruthy();
            });
        });
    });
});