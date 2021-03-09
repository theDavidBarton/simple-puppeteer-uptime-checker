/*
   MIT License

   Copyright (c) 2021 David Barton

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
const path = require('path');
const monitoring = require('./monitoring');
const config = require(path.join(process.cwd(), 'site-config.json'));
const arg = process.argv[2] || '--none';

// notificationType: '--none'[default], '--all', '--slack', '--email'
async function simpleUptimeCheck({ args: [notificationType = arg] } = { args: [] }) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const browserWSEndpoint = browser.wsEndpoint();

  for (const siteData of config) {
    const site = siteData.site;
    const selector = siteData.selector;
    try {
      await monitoring(site, selector, browserWSEndpoint, notificationType);
    } catch (e) {
      console.error(e);
    }
  }
  await browser.close();
}

module.exports = simpleUptimeCheck;
