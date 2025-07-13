import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly swagLabsLogo: Locator;
  readonly loginCredentials: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.swagLabsLogo = page.locator('.login_logo');
    this.loginCredentials = page.locator('#login_credentials');
  }

  /**
   * Navigate to the login page
   */
  async navigate(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with given credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Login with standard user credentials
   */
  async loginAsStandardUser(): Promise<void> {
    await this.login('standard_user', 'secret_sauce');
  }

  /**
   * Attempt login with locked out user
   */
  async loginAsLockedOutUser(): Promise<void> {
    await this.login('locked_out_user', 'secret_sauce');
  }

  /**
   * Login with problem user credentials
   */
  async loginAsProblemUser(): Promise<void> {
    await this.login('problem_user', 'secret_sauce');
  }

  /**
   * Login with performance glitch user
   */
  async loginAsPerformanceGlitchUser(): Promise<void> {
    await this.login('performance_glitch_user', 'secret_sauce');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.errorMessage.textContent() || '';
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
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  /**
   * Get available usernames from the page
   */
  async getAvailableUsernames(): Promise<string[]> {
    const credentialsText = await this.loginCredentials.textContent();
    if (!credentialsText) return [];
    
    const lines = credentialsText.split('\n');
    const usernames: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.includes('Password') && !trimmed.includes('Accepted')) {
        usernames.push(trimmed);
      }
    }
    
    return usernames;
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if Swag Labs logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.swagLabsLogo.isVisible();
  }
}