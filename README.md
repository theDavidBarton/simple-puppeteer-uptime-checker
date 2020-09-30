[![Dependency Status](https://david-dm.org/theDavidBarton/simple-puppeteer-uptime-checker.svg)](https://david-dm.org/theDavidBarton/simple-puppeteer-uptime-checker)
![crocodile](https://img.shields.io/badge/crocodiles_in_the_basement-%F0%9F%90%8A_yes-orange.svg)

# simple-puppeteer-uptime-checker

A simple uptime (site health) checker tool made with Puppeteer (headless Chrome).

# Usage

Fill the [siteConfig.json](./siteConfig.json) with the (1) sites you want to monitor, and (2) add one key element's [selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) as well per url (be careful using only `"body"`, as even error pages has a valid `<body>`).

In this example the first site will throw an error due to bad ssl certificate:

```json
[
  { "site": "https://expired.badssl.com/", "selector": "#dashboard" },
  { "site": "https://badssl.com/", "selector": "#dashboard" },
  { "site": "https://google.com", "selector": "body" }
]
```

## Run

```
$ node index.js
HEALTH CHECK FAILED on https://expired.badssl.com/ with HTTP unknown status (Error)
HEALTH CHECK PASSED on https://badssl.com/ with HTTP 200
HEALTH CHECK PASSED on https://google.com with HTTP 200
```

## Schedule it

You can run the script from a scheduled (cron) pipeline.

## Notifications

By default you will need a `WEBHOOKS_URL` environment variable with the exact url as string to use it with Slack webhooks. But you can replace it with a [Nodemailer](https://nodemailer.com/about/) module if it fits your needs better. It can be set in [monitoring.js](./monitoring.js)

# License

MIT License

Copyright (c) 2020 David Barton
