import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle0' });
    
    // Wait for the courses to load
    await page.waitForSelector('.explore-course-card');
    
    // Click the first course
    const courses = await page.$$('.explore-course-card');
    if (courses.length > 0) {
      await courses[0].click();
      
      // Wait for modal and click "Search for Mentor"
      await page.waitForTimeout(1000); // wait for modal to animate
      
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.includes('Search for Mentor')) {
          await btn.click();
          break;
        }
      }
      
      await page.waitForTimeout(2000); // wait to see if error occurs
    } else {
      console.log("No courses found");
    }
  } catch (e) {
    console.log('SCRIPT ERROR:', e);
  } finally {
    await browser.close();
  }
})();
