import puppeteer from 'puppeteer';

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('REACT PAGE CRASH:', err.toString());
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle0' });
    
    // Switch to Courses tab
    const tabs = await page.$$('button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text === 'Courses') {
        await tab.click();
        break;
      }
    }
    
    await delay(500);
    
    // Wait for the courses to load
    await page.waitForSelector('.explore-course-card');
    
    // Click the Mobile application development course
    const courses = await page.$$('.explore-course-card');
    for (const course of courses) {
      const title = await page.evaluate(el => el.innerText, course);
      if (title.toLowerCase().includes('mobile application')) {
        await course.click();
        break;
      }
    }
    
    // Wait for modal and click "Search for Mentor"
    await delay(1000);
    
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Search for Mentor')) {
        console.log("Clicking Search for Mentor button...");
        await btn.click();
        break;
      }
    }
    
    await delay(2000);
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("BODY AFTER CLICK:", bodyText.substring(0, 100).replace(/\n/g, ' '));
    
  } catch (e) {
    console.log('SCRIPT ERROR:', e);
  } finally {
    await browser.close();
  }
})();
