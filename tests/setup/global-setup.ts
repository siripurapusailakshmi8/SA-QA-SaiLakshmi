import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global setup function that runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Sauce Demo Test Suite Setup...');
  
  // Create directories for test results if they don't exist
  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces',
    'test-results/html-report'
  ];

  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }

  // Log test configuration
  console.log(`🌐 Base URL: ${config.use?.baseURL || 'Not configured'}`);
  console.log(`🖥️  Projects: ${config.projects?.map(p => p.name).join(', ') || 'None'}`);
  console.log(`👥 Workers: ${config.workers || 1}`);
  console.log(`🔄 Retries: ${config.retries || 0}`);
  
  console.log('✅ Global setup completed successfully!\n');
}

export default globalSetup;