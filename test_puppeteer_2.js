import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('PAGE ERROR (on load):', err.toString());
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  try {
    console.log("Navigating...");
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle0' });
    
    // Check if body is empty or has a React error overlay
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("BODY TEXT (first 100 chars):", bodyText.substring(0, 100).replace(/\n/g, " "));

  } catch (e) {
    console.log('SCRIPT ERROR:', e);
  } finally {
    await browser.close();
  }
})();
