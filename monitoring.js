/*
MIT License

Copyright (c) 2020 David Barton
*/

const puppeteer = require('puppeteer')
const request = require('request')

async function monitoring(url, selector, browserWSEndpoint) {
  const maxRetry = 5
  let browser
  let page
  let failed = false
  let cause = 'unknown error'
  let responseCode = 'unknown status'

  try {
    browser = await puppeteer.connect({ browserWSEndpoint })
    page = await browser.newPage()
    await page.setUserAgent('github.com/theDavidBarton/simple-puppeteer-uptime-checker')
    for (let retry = 1; retry <= maxRetry; retry++) {
      try {
        const response = await page.goto(url)
        responseCode = response.status()
        failed = false
        cause = 'unknown error'
        break
      } catch (e) {
        failed = true
        cause = e.name
        console.log(`- ${url} retries after ${retry} unsuccessful attempt(s)`)
      }
    }
    if (responseCode === 200) await page.waitForSelector(selector)
  } catch (e) {
    failed = true
    cause = e.name
  }

  if (failed || responseCode !== 200) {
    console.log(`HEALTH CHECK FAILED on ${url} with HTTP ${responseCode} (${cause})`)

    request(
      {
        url: process.env.WEBHOOKS_URL,
        method: 'POST',
        json: false,
        body: JSON.stringify({
          text: `HEALTH CHECK *FAILED* on ${url} with HTTP ${responseCode} (${cause})`
        })
      },
      function(e, resp, body) {
        if (e) {
          console.error(e)
        }
      }
    )
  } else {
    console.log(`HEALTH CHECK PASSED on ${url} with HTTP ${responseCode}`)
  }
  await page.goto('about:blank')
  await page.close()
  await browser.disconnect()
}

module.exports = monitoring
