import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOTS_DIR = path.join(__dirname, '../../../docs/screenshots');
const BASE_URL = 'http://localhost:3001';

// Test credentials
const TEST_USER = {
  email: 'admin@ecommerce.com',
  password: 'Admin@123',
};

async function captureScreenshots() {
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  try {
    console.log('🔐 Logging in...');
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for data to load

    console.log('📸 Capturing Dashboard...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'dashboard.png'),
      fullPage: true,
    });

    console.log('📸 Capturing Products...');
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'products.png'),
      fullPage: true,
    });

    console.log('📸 Capturing Orders...');
    await page.goto(`${BASE_URL}/orders`);
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'orders.png'),
      fullPage: true,
    });

    console.log('📸 Capturing Analytics...');
    await page.goto(`${BASE_URL}/analytics`);
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'analytics.png'),
      fullPage: true,
    });

    console.log('📸 Capturing Customers...');
    await page.goto(`${BASE_URL}/customers`);
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'customers.png'),
      fullPage: true,
    });

    console.log('✅ All screenshots captured successfully!');
    console.log(`📁 Saved to: ${SCREENSHOTS_DIR}`);
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
