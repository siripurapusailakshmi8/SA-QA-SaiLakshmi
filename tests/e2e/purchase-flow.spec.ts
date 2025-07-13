import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFORMATION, PRODUCTS } from '../data/testData';

test.describe('Purchase Flow Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Navigate to login page
        await loginPage.navigate();
    });

    test.skip('Complete purchase flow with single item', async ({ page }) => {
        // Step 1: Login
        await test.step('Login as standard user', async () => {
            await loginPage.loginAsStandardUser();
            await expect(page).toHaveURL(/.*inventory/);
            expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);
        });

        // Step 2: Add item to cart
        let selectedProduct: string;
        await test.step('Add item to cart', async () => {
            selectedProduct = await inventoryPage.addFirstProductToCart();
            expect(selectedProduct).toBeTruthy();

            // Verify cart badge shows 1 item
            const cartCount = await inventoryPage.getCartItemCount();
            expect(cartCount).toBe(1);

            // Verify product shows as added (Remove button visible)
            const isInCart = await inventoryPage.isProductInCart(selectedProduct);
            expect(isInCart).toBe(true);
        });

        // Step 3: Navigate to cart
        await test.step('Navigate to shopping cart', async () => {
            await inventoryPage.goToCart();
            await expect(page).toHaveURL(/.*cart/);
            expect(await cartPage.isCartPageDisplayed()).toBe(true);
        });

        // Step 4: Verify cart contents
        await test.step('Verify cart contents', async () => {
            const cartItems = await cartPage.getCartItemNames();
            expect(cartItems).toContain(selectedProduct);
            expect(cartItems.length).toBe(1);

            // Verify item details
            const itemDetails = await cartPage.getItemDetails(selectedProduct);
            expect(itemDetails).toBeTruthy();
            expect(itemDetails!.name).toBe(selectedProduct);
            expect(itemDetails!.quantity).toBe('1');
        });

        // Step 5: Proceed to checkout
        await test.step('Proceed to checkout', async () => {
            await cartPage.proceedToCheckout();
            await expect(page).toHaveURL(/.*checkout-step-one/);
            expect(await checkoutPage.isCheckoutInformationPageDisplayed()).toBe(true);
        });

        // Step 6: Fill checkout information
        await test.step('Fill checkout information', async () => {
            await checkoutPage.completeInformationStep(
                CHECKOUT_INFORMATION.VALID.firstName,
                CHECKOUT_INFORMATION.VALID.lastName,
                CHECKOUT_INFORMATION.VALID.postalCode
            );

            await expect(page).toHaveURL(/.*checkout-step-two/);
            expect(await checkoutPage.isCheckoutOverviewPageDisplayed()).toBe(true);
        });

        // Step 7: Verify checkout overview
        await test.step('Verify checkout overview', async () => {
            const overviewItems = await checkoutPage.getOverviewItems();
            expect(overviewItems.length).toBe(1);
            expect(overviewItems[0].name).toBe(selectedProduct);
            expect(overviewItems[0].quantity).toBe('1');

            // Verify payment and shipping info
            const paymentInfo = await checkoutPage.getPaymentInfo();
            const shippingInfo = await checkoutPage.getShippingInfo();
            expect(paymentInfo).toBeTruthy();
            expect(shippingInfo).toBeTruthy();

            // Verify calculations
            const isCalculationCorrect = await checkoutPage.verifyCheckoutCalculations();
            expect(isCalculationCorrect).toBe(true);
        });

        // Step 8: Complete purchase
        await test.step('Complete purchase', async () => {
            await checkoutPage.finishOrder();
            await expect(page).toHaveURL(/.*checkout-complete/);
            expect(await checkoutPage.isCheckoutCompletePageDisplayed()).toBe(true);

            // Verify completion message
            const completionMessage = await checkoutPage.getCompletionMessage();
            expect(completionMessage.header).toContain('Thank you');
            expect(completionMessage.text).toBeTruthy();
        });

        // Step 9: Return to products
        await test.step('Return to products page', async () => {
            await checkoutPage.backToProducts();
            await expect(page).toHaveURL(/.*inventory/);
            expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);

            // Verify cart is empty after purchase
            const cartCount = await inventoryPage.getCartItemCount();
            expect(cartCount).toBe(0);
        });
    });

    test('Complete purchase flow with multiple items', async ({ page }) => {
        // Login
        await loginPage.loginAsStandardUser();
        expect(await inventoryPage.isInventoryPageDisplayed()).toBe(true);

        // Add multiple items to cart
        const selectedProducts = await inventoryPage.addMultipleProductsToCart([0, 2, 4]);
        expect(selectedProducts.length).toBe(3);

        // Verify cart count
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(3);

        // Navigate to cart and verify contents
        await inventoryPage.goToCart();
        const cartItems = await cartPage.getCartItemNames();
        expect(cartItems.length).toBe(3);

        for (const product of selectedProducts) {
            expect(cartItems).toContain(product);
        }

        // Complete checkout process
        await cartPage.proceedToCheckout();
        await checkoutPage.completeInformationStep(
            CHECKOUT_INFORMATION.VALID.firstName,
            CHECKOUT_INFORMATION.VALID.lastName,
            CHECKOUT_INFORMATION.VALID.postalCode
        );

        // Verify overview has all items
        const overviewItems = await checkoutPage.getOverviewItems();
        expect(overviewItems.length).toBe(3);

        // Complete purchase
        await checkoutPage.finishOrder();
        expect(await checkoutPage.isCheckoutCompletePageDisplayed()).toBe(true);
    });

    test('Verify checkout calculations accuracy', async ({ page }) => {
        // Login and add specific items with known prices
        await loginPage.loginAsStandardUser();

        // Add Sauce Labs Backpack ($29.99) and Bike Light ($9.99)
        await inventoryPage.addProductToCart(PRODUCTS.SAUCE_LABS_BACKPACK);
        await inventoryPage.addProductToCart(PRODUCTS.SAUCE_LABS_BIKE_LIGHT);

        // Navigate through checkout
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.completeInformationStep(
            CHECKOUT_INFORMATION.VALID.firstName,
            CHECKOUT_INFORMATION.VALID.lastName,
            CHECKOUT_INFORMATION.VALID.postalCode
        );

        // Verify detailed calculations
        const itemTotalText = await checkoutPage.getItemTotal();
        const taxText = await checkoutPage.getTaxAmount();
        const totalText = await checkoutPage.getTotalAmount();

        // Expected: $29.99 + $9.99 = $39.98 + tax
        expect(itemTotalText).toContain('39.98');
        expect(taxText).toContain('3.20'); // 8% tax
        expect(totalText).toContain('43.18'); // Total with tax
    });
});
