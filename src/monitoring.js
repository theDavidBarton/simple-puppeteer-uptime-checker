/*
   MIT License

   Copyright (c) 2022 David Barton

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE. */

const puppeteer = require('puppeteer');
const { email, slack } = require('./notifications');

async function monitoring(url, selector, browserWSEndpoint, notificationType) {
  const maxRetry = 5;
  let browser;
  let page;
  let failed = false;
  let cause = 'unknown error';
  let responseCode = 'unknown status';

  try {
    browser = await puppeteer.connect({ browserWSEndpoint });
    page = await browser.newPage();
    await page.setUserAgent('simple-puppeteer-uptime-checker');
    for (let retry = 1; retry <= maxRetry; retry++) {
      try {
        const response = await page.goto(url);
        responseCode = response.status();
        failed = false;
        cause = 'unknown error';
        break;
      } catch (e) {
        failed = true;
        cause = e.name;
        console.log(`- ${url} retries after ${retry} unsuccessful attempt(s)`);
      }
    }
    if (responseCode === 200) await page.waitForSelector(selector);
  } catch (e) {
    failed = true;
    cause = e.name;
  }

  if (failed || responseCode !== 200) {
    const failedMessage = `HEALTH CHECK FAILED on ${url} with HTTP ${responseCode} (${cause})`;
    console.log(failedMessage);
    if (notificationType !== '--none' && notificationType) {
      notificationType === '--email' || notificationType === '--all' ? email(failedMessage) : console.log('no email selected');
      notificationType === '--slack' || notificationType === '--all' ? slack(failedMessage) : console.log('no slack selected');
    }
  } else {
    const passedMessage = `HEALTH CHECK PASSED on ${url} with HTTP ${responseCode}`;
    console.log(passedMessage);
  }
  await page.goto('about:blank');
  await page.close();
  await browser.disconnect();
}

module.exports = monitoring;
