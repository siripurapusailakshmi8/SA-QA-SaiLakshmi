# Defect Report

## Bug ID: SWL-001

**Title**: Checkout process allows empty cart to proceed to information page

**Reporter**: QA Engineer  
**Date**: July 13, 2025  
**Environment**: Chrome 126.0.6478.114, Windows 11  
**URL**: https://www.saucedemo.com

---

## Summary
The checkout process incorrectly allows users to proceed to the checkout information page even when their shopping cart is empty, which violates standard e-commerce UX patterns and could lead to user confusion.

## Steps to Reproduce
1. Navigate to https://www.saucedemo.com
2. Login with credentials: `standard_user` / `secret_sauce`
3. Click on the shopping cart icon (without adding any items)
4. Verify the cart page shows "Your Cart" with no items
5. Click the "Checkout" button

## Expected Result
- The checkout button should be disabled when cart is empty, OR
- Clicking checkout should display an error message like "Your cart is empty. Please add items before proceeding to checkout", OR  
- User should be redirected back to the products page with a notification

## Actual Result
- The checkout button is clickable even with an empty cart
- User is taken to "Checkout: Your Information" page (/checkout-step-one.html)
- No validation occurs to prevent empty cart checkout

## Additional Information
**Severity**: Medium  
**Priority**: Medium  
**Type**: Functional Bug  

**Business Impact**: Users may become confused when reaching the checkout information page with no items to purchase, potentially leading to cart abandonment and poor user experience.

**Workaround**: None identified from user perspective. Users must manually navigate back to add items.

**Browser Info**: Also reproduced on Firefox 116.0 and Safari 16.0

## Attachments
- Screenshot: empty_cart_checkout_allowed.png
- Video: empty_cart_flow_demo.mp4

## Test Data Used
- User: standard_user / secret_sauce
- Cart state: Empty (0 items)

---

**Note**: This defect was discovered during automation test development when creating negative test cases for cart validation scenarios.