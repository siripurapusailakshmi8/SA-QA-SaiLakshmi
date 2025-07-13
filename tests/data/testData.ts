/**
 * Test data constants for Sauce Demo automation tests
 */

export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  },
  INVALID: {
    username: 'invalid_user',
    password: 'wrong_password'
  }
} as const;

export const CHECKOUT_INFORMATION = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  INCOMPLETE: {
    firstName: 'Jane',
    lastName: '',
    postalCode: '67890'
  },
  EMPTY: {
    firstName: '',
    lastName: '',
    postalCode: ''
  }
} as const;

export const PRODUCTS = {
  SAUCE_LABS_BACKPACK: 'Sauce Labs Backpack',
  SAUCE_LABS_BIKE_LIGHT: 'Sauce Labs Bike Light',
  SAUCE_LABS_BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  SAUCE_LABS_FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  SAUCE_LABS_ONESIE: 'Sauce Labs Onesie',
  TEST_ALLTHETHINGS_TSHIRT: 'Test.allTheThings() T-Shirt (Red)'
} as const;

export const PRODUCT_PRICES = {
  [PRODUCTS.SAUCE_LABS_BACKPACK]: '$29.99',
  [PRODUCTS.SAUCE_LABS_BIKE_LIGHT]: '$9.99',
  [PRODUCTS.SAUCE_LABS_BOLT_TSHIRT]: '$15.99',
  [PRODUCTS.SAUCE_LABS_FLEECE_JACKET]: '$49.99',
  [PRODUCTS.SAUCE_LABS_ONESIE]: '$7.99',
  [PRODUCTS.TEST_ALLTHETHINGS_TSHIRT]: '$15.99'
} as const;

export const ERROR_MESSAGES = {
  LOCKED_OUT_USER: 'Epic sadface: Sorry, this user has been locked out.',
  MISSING_USERNAME: 'Epic sadface: Username is required',
  MISSING_PASSWORD: 'Epic sadface: Password is required',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  MISSING_FIRST_NAME: 'Error: First Name is required',
  MISSING_LAST_NAME: 'Error: Last Name is required',
  MISSING_POSTAL_CODE: 'Error: Postal Code is required'
} as const;

export const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo'
} as const;

export const URLS = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html'
} as const;

export const PAGE_TITLES = {
  LOGIN: 'Swag Labs',
  INVENTORY: 'Products',
  CART: 'Your Cart',
  CHECKOUT_INFORMATION: 'Checkout: Your Information',
  CHECKOUT_OVERVIEW: 'Checkout: Overview',
  CHECKOUT_COMPLETE: 'Checkout: Complete!'
} as const;

export const TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 10000,
  LONG: 30000
} as const;