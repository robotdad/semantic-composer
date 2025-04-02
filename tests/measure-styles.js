// Direct script to measure styles without test framework overhead
const { chromium } = require('playwright');

async function measureEditorStyles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Navigating to editor...');
    await page.goto('http://localhost:3000');
    
    // Wait for editor to initialize
    await page.waitForSelector('.milkdown-editor-wrapper', { timeout: 10000 });
    console.log('✅ Editor loaded in EDIT/RICH mode');
    
    // Create output directory
    await page.evaluate(() => {
      console.log = function(message) {
        if (typeof message === 'object') {
          message = JSON.stringify(message, null, 2);
        }
        const pre = document.createElement('pre');
        pre.textContent = message;
        document.body.appendChild(pre);
      };
    });
    
    // Get edit mode styles
    const editRichModeStyles = await page.evaluate(() => {
      const styles = {};
      
      // Check editor container
      const editorWrapper = document.querySelector('.milkdown-editor-wrapper');
      if (editorWrapper) {
        const wrapperStyle = window.getComputedStyle(editorWrapper);
        styles.wrapper = {
          width: wrapperStyle.width,
          padding: wrapperStyle.padding,
          margin: wrapperStyle.margin
        };
      }
      
      // Check milkdown container
      const milkdown = document.querySelector('.milkdown');
      if (milkdown) {
        const milkdownStyle = window.getComputedStyle(milkdown);
        styles.milkdown = {
          width: milkdownStyle.width,
          paddingTop: milkdownStyle.paddingTop,
          paddingRight: milkdownStyle.paddingRight,
          paddingBottom: milkdownStyle.paddingBottom,
          paddingLeft: milkdownStyle.paddingLeft,
          fontFamily: milkdownStyle.fontFamily,
          fontSize: milkdownStyle.fontSize,
          lineHeight: milkdownStyle.lineHeight
        };
      }
      
      // Check paragraph
      const paragraph = document.querySelector('.milkdown p');
      if (paragraph) {
        const paragraphStyle = window.getComputedStyle(paragraph);
        styles.paragraph = {
          fontFamily: paragraphStyle.fontFamily,
          fontSize: paragraphStyle.fontSize,
          lineHeight: paragraphStyle.lineHeight
        };
      }
      
      // Check heading
      const heading = document.querySelector('.milkdown h1, .milkdown h2, .milkdown h3');
      if (heading) {
        const headingStyle = window.getComputedStyle(heading);
        styles.heading = {
          fontFamily: headingStyle.fontFamily,
          fontSize: headingStyle.fontSize,
          fontWeight: headingStyle.fontWeight,
          lineHeight: headingStyle.lineHeight
        };
      }
      
      return styles;
    });
    
    console.log('=== EDIT + RICH MODE STYLES ===');
    console.log(JSON.stringify(editRichModeStyles, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'tests/edit-rich-mode.png' });
    console.log('📸 Screenshot saved for EDIT/RICH mode');
    
    // Switch to READ mode
    await page.click('button:has-text("Read")');
    await page.waitForTimeout(1000);
    console.log('✅ Switched to READ mode');
    
    // Get read mode styles
    const readModeStyles = await page.evaluate(() => {
      const styles = {};
      
      // Check editor container
      const editorWrapper = document.querySelector('.milkdown-editor-wrapper');
      if (editorWrapper) {
        const wrapperStyle = window.getComputedStyle(editorWrapper);
        styles.wrapper = {
          width: wrapperStyle.width,
          padding: wrapperStyle.padding,
          margin: wrapperStyle.margin
        };
      }
      
      // Check milkdown container
      const milkdown = document.querySelector('.milkdown');
      if (milkdown) {
        const milkdownStyle = window.getComputedStyle(milkdown);
        styles.milkdown = {
          width: milkdownStyle.width,
          paddingTop: milkdownStyle.paddingTop,
          paddingRight: milkdownStyle.paddingRight,
          paddingBottom: milkdownStyle.paddingBottom,
          paddingLeft: milkdownStyle.paddingLeft,
          fontFamily: milkdownStyle.fontFamily,
          fontSize: milkdownStyle.fontSize,
          lineHeight: milkdownStyle.lineHeight
        };
      }
      
      // Check paragraph
      const paragraph = document.querySelector('.milkdown p');
      if (paragraph) {
        const paragraphStyle = window.getComputedStyle(paragraph);
        styles.paragraph = {
          fontFamily: paragraphStyle.fontFamily,
          fontSize: paragraphStyle.fontSize,
          lineHeight: paragraphStyle.lineHeight
        };
      }
      
      // Check heading
      const heading = document.querySelector('.milkdown h1, .milkdown h2, .milkdown h3');
      if (heading) {
        const headingStyle = window.getComputedStyle(heading);
        styles.heading = {
          fontFamily: headingStyle.fontFamily,
          fontSize: headingStyle.fontSize,
          fontWeight: headingStyle.fontWeight,
          lineHeight: headingStyle.lineHeight
        };
      }
      
      return styles;
    });
    
    console.log('=== READ MODE STYLES ===');
    console.log(JSON.stringify(readModeStyles, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'tests/read-mode.png' });
    console.log('📸 Screenshot saved for READ mode');
    
    // Switch back to EDIT mode
    await page.click('button:has-text("Edit")');
    await page.waitForTimeout(500);
    
    // Switch to RAW mode
    await page.click('button:has-text("Raw")');
    await page.waitForTimeout(500);
    console.log('✅ Switched to EDIT/RAW mode');
    
    // Get raw mode styles
    const rawModeStyles = await page.evaluate(() => {
      const styles = {};
      
      // Check textarea
      const textarea = document.querySelector('.raw-editor');
      if (textarea) {
        const textareaStyle = window.getComputedStyle(textarea);
        styles.textarea = {
          width: textareaStyle.width,
          paddingTop: textareaStyle.paddingTop,
          paddingRight: textareaStyle.paddingRight,
          paddingBottom: textareaStyle.paddingBottom,
          paddingLeft: textareaStyle.paddingLeft,
          fontFamily: textareaStyle.fontFamily,
          fontSize: textareaStyle.fontSize,
          lineHeight: textareaStyle.lineHeight
        };
      }
      
      return styles;
    });
    
    console.log('=== RAW MODE STYLES ===');
    console.log(JSON.stringify(rawModeStyles, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'tests/raw-mode.png' });
    console.log('📸 Screenshot saved for RAW mode');
    
    // Analyze consistency
    const fontConsistency = 
      editRichModeStyles.milkdown?.fontFamily === readModeStyles.milkdown?.fontFamily && 
      editRichModeStyles.milkdown?.fontSize === readModeStyles.milkdown?.fontSize &&
      rawModeStyles.textarea?.fontFamily === editRichModeStyles.milkdown?.fontFamily;
    
    const paddingConsistency = 
      editRichModeStyles.milkdown?.paddingLeft === readModeStyles.milkdown?.paddingLeft && 
      editRichModeStyles.milkdown?.paddingLeft === rawModeStyles.textarea?.paddingLeft;
    
    console.log('\n=== CONSISTENCY ANALYSIS ===');
    console.log(`Font consistency across modes: ${fontConsistency ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
    console.log(`Padding consistency across modes: ${paddingConsistency ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
    
    // Check if the padding values are small enough
    const smallPadding = 
      parseInt(editRichModeStyles.milkdown?.paddingLeft || '100px') <= 8 &&
      parseInt(readModeStyles.milkdown?.paddingLeft || '100px') <= 8;
    
    console.log(`Padding size appropriate: ${smallPadding ? '✅ OK' : '❌ TOO LARGE'}`);
    
  } catch (error) {
    console.error('Error measuring styles:', error);
  } finally {
    await browser.close();
    console.log('Measurement complete. Check the tests directory for screenshots.');
  }
}

// Run the measurements
measureEditorStyles().catch(console.error);