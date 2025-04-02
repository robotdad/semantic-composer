// @ts-check
const { test, expect } = require('@playwright/test');

// Simple E2E tests to verify rendering behavior of Cortex Composer
test('editor styling consistency between modes', async ({ page }) => {
  // Go to the editor page
  await page.goto('http://localhost:3000');
  
  // Wait for editor to fully initialize
  await page.waitForSelector('.milkdown-editor-wrapper');
  
  // Take screenshot in edit mode
  await page.screenshot({ path: './tests/edit-mode.png' });
  console.log('Captured edit mode screenshot');
  
  // Switch to read mode
  await page.click('button:has-text("Read")');
  await page.waitForTimeout(500); // Wait for transition 
  
  // Take screenshot in read mode
  await page.screenshot({ path: './tests/read-mode.png' });
  console.log('Captured read mode screenshot');
  
  // Switch back to edit mode
  await page.click('button:has-text("Edit")');
  await page.waitForTimeout(500);
  
  // Switch to raw mode
  await page.click('button:has-text("Raw")');
  await page.waitForTimeout(500);
  
  // Take screenshot in raw mode
  await page.screenshot({ path: './tests/raw-mode.png' });
  console.log('Captured raw mode screenshot');
  
  // Visual comparison - not automated but will produce screenshots for manual comparison
  console.log('Test complete - check screenshots for visual consistency');
});

// Test for padding and margins
test('editor padding and margins', async ({ page }) => {
  // Go to the editor page
  await page.goto('http://localhost:3000');
  
  // Wait for editor to fully initialize
  await page.waitForSelector('.milkdown-editor-wrapper');
  
  // Take close-up screenshot of the editor area
  const editorElement = await page.locator('.editor-content');
  await editorElement.screenshot({ path: './tests/editor-padding.png' });
  console.log('Captured editor padding screenshot');
  
  // Switch to read mode and capture again
  await page.click('button:has-text("Read")');
  await page.waitForTimeout(500);
  await editorElement.screenshot({ path: './tests/read-mode-padding.png' });
  console.log('Captured read mode padding screenshot');
  
  // Check actual CSS properties for padding 
  const editModePadding = await page.evaluate(() => {
    const editorContent = document.querySelector('.milkdown');
    if (editorContent) {
      const style = window.getComputedStyle(editorContent);
      return {
        paddingTop: style.paddingTop,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize
      };
    }
    return null;
  });
  
  console.log('Edit mode padding:', editModePadding);
  
  // Back to edit, then to raw mode
  await page.click('button:has-text("Edit")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Raw")');
  await page.waitForTimeout(500);
  
  // Check raw mode padding
  const rawModePadding = await page.evaluate(() => {
    const textarea = document.querySelector('.raw-editor');
    if (textarea) {
      const style = window.getComputedStyle(textarea);
      return {
        paddingTop: style.paddingTop,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize
      };
    }
    return null;
  });
  
  console.log('Raw mode padding:', rawModePadding);
});