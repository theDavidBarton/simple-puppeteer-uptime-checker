/*
MIT License

Copyright (c) 2020 David Barton
*/

const puppeteer = require('puppeteer')
const monitoring = require('./monitoring')
const siteConfig = require('./siteConfig.json')

async function monitoringRunner() {
  const browser = await puppeteer.launch({ headless: true })
  const browserWSEndpoint = await browser.wsEndpoint()

  for (const siteData of siteConfig) {
    const site = siteData.site
    const selector = siteData.selector
    try {
      await monitoring(site, selector, browserWSEndpoint)
    } catch (e) {
      console.error(e)
    }
  }
  await browser.close()
}
monitoringRunner()
