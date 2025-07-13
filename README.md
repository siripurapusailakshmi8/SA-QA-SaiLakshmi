# SA-QA-SauceDemo

Automated test suite for Sauce Demo e-commerce application using Playwright with TypeScript.

## Project Overview

This project provides comprehensive end-to-end test automation for the Sauce Labs demo application (https://www.saucedemo.com), covering critical user journeys including login, product browsing, cart management, and checkout processes.

##  Prerequisites

### System Requirements
- **Node.js**: v16.0.0 or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Linux Ubuntu 20.04+
- **Memory**: Minimum 4GB RAM recommended
- **Internet**: Stable connection required for test execution

### Development Tools (Optional)
- **IDE**: Visual Studio Code, WebStorm, or any TypeScript-compatible editor
- **Git**: For version control

##  Quick Start

### 1. Clone the Repository
```bash
git clone {{RepoUrl}}
cd SA-QA-SauceDemo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Browser Binaries
```bash
npm run install:browsers
```

### 4. Run Tests
```bash
# Run all tests (default: headless mode)
npm test

# Run tests with browser UI visible
npm run test:headed

# Run specific test file
npx playwright test tests/e2e/purchase-flow.spec.ts

# Run tests on specific browser
npx playwright test --project=chromium
```



##  Test Execution Options

### Basic Commands
```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Debug mode (step through tests)
npm run test:debug

# Generate and view HTML report
npm run test:report
```

### Advanced Execution
```bash
# Run specific test suite
npx playwright test tests/e2e/purchase-flow.spec.ts

# Run tests on multiple browsers
npx playwright test --project=chromium --project=firefox

# Run tests in parallel
npx playwright test --workers=3

# Run tests with specific timeout
npx playwright test --timeout=60000

# Run tests with retries
npx playwright test --retries=2

# Run tests with specific grep pattern
npx playwright test --grep "purchase flow"
```

### Environment Variables
```bash
# Set custom base URL
BASE_URL=https://www.saucedemo.com npm test

# Run in CI mode
CI=true npm test

# Set custom timeout
TIMEOUT=30000 npm test
```

##  Test Reports

### HTML Report
After test execution, an HTML report is automatically generated:
```bash
# View the latest report
npm run test:report
```
**Location**: `test-results/html-report/index.html`

### JUnit XML Report
For CI/CD integration:
**Location**: `test-results/junit-results.xml`

### Artifacts
- **Screenshots**: Captured on test failures (`test-results/screenshots/`)
- **Videos**: Recorded for failed tests (`test-results/videos/`)
- **Traces**: Detailed execution traces (`test-results/traces/`)

##  Continuous Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: test-results/
```

### Jenkins Pipeline Example
```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'test-results/html-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report'
                    ])
                }
            }
        }
    }
}
```

##  Configuration

### Playwright Configuration
The `playwright.config.ts` file contains:
- **Browser settings**: Chrome, Firefox, Safari support
- **Test timeouts**: 30s per test, 10s for assertions
- **Retry logic**: Automatic retries on CI
- **Reporting**: HTML, JUnit, and console reporters
- **Screenshots/Videos**: Captured on failures

### Test Data Management
Test data is centralized in `tests/data/testData.ts`:
- User credentials
- Product information
- Error messages
- Test constants

## 🔍 Debugging

### Debug Failed Tests
```bash
# Run in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test tests/e2e/purchase-flow.spec.ts --debug

# View trace for failed test
npx playwright show-trace test-results/trace.zip
```

### Common Issues

**Issue**: `Browser not found`
```bash
# Solution: Install browsers
npm run install:browsers
```

**Issue**: `Timeout waiting for element`
```bash
# Solution: Increase timeout in playwright.config.ts or use custom waits
```

**Issue**: `Tests fail intermittently`
```bash
# Solution: Enable retries and check for race conditions
```

##  Test Strategy

Refer to `docs/Test-Strategy.md` for detailed information about:
- Risk assessment and prioritization
- Automation layers and approach
- CI/CD integration strategy
- Maintenance and scaling plans

##  Bug Reporting

Found a bug during automation? See `docs/Defect-Report.md` for the reporting template and process.

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-test`)
3. Commit changes (`git commit -am 'Add new test scenario'`)
4. Push to branch (`git push origin feature/new-test`)
5. Create a Pull Request

