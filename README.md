[![Dependency Status](https://david-dm.org/theDavidBarton/simple-puppeteer-uptime-checker.svg)](https://david-dm.org/theDavidBarton/simple-puppeteer-uptime-checker)
![crocodile](https://img.shields.io/badge/crocodiles_in_the_basement-%F0%9F%90%8A_yes-orange.svg)

# simple-puppeteer-uptime-checker

A simple uptime (site health) checker tool made with Puppeteer (headless Chrome).

# Usage

## Install & setup

```bash
npm install simple-puppeteer-uptime-checker
```

Create a [site-config.json](./site-config.json) at the root of your Node.js project with the (1) sites you want to monitor, and (2) add one key element's [selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) as well per url (be careful using simply `"body"`, as even error pages has a valid `<body>` element).

In this example the first site will throw an error due to bad ssl certificate:

```json
[
  { "site": "https://expired.badssl.com/", "selector": "#dashboard" },
  { "site": "https://badssl.com/", "selector": "#dashboard" },
  { "site": "https://google.com", "selector": "body" }
]
```

### Notifications

You can create notifications via (A) a [**Gmail**](https://www.google.com/gmail/) email address and/or (B) **Slack's** [**Incoming Webhooks**](https://api.slack.com/messaging/webhooks).  
You can set which one to use with notification type (see in ['Run'](#run)).

### Environment variables

(1) touch an `puppeteer-uptime.env` file (gitignored) in the root folder.

```bash
# gmail credentials
export GMAIL_ADDRESS="<your-email>@gmail.com"
export GMAIL_PASSWORD="**************"
export NOTIFICATION_EMAIL_ADDRESS="<notification-email>@<provider>"

# slack webhooks
export WEBHOOKS_URL="https://hooks.slack.com/services/*********/*********/************************"
```

(2) source the created file to local environment variables (depending on your platform you'll need to find a method which lasts more than the current session!):

```bash
$ source puppeteer-uptime.env
```

## Run

**Notification type** is the sole (optional) parameter: `'--none'`(default), `'--all'`, `'--slack'`, `'--email'`.

**CLI usage:**

```bash
npx simple-puppeteer-uptime-checker
```

```bash
npx simple-puppeteer-uptime-checker --slack
```

OR via Yarn:

```bash
yarn simple-puppeteer-uptime-checker
```

**In app usage:**

```javascript
const simpleUptimeCheck = require('simple-puppeteer-uptime-checker');
(async () => {
  await simpleUptimeCheck();
})();
```

_Note:_ In app function parameters have higher priority than cli arguments.

```javascript
const simpleUptimeCheck = require('simple-puppeteer-uptime-checker');
(async () => {
  await simpleUptimeCheck({ args: ['--slack'] });
})();
```

**Output:**

```bash
HEALTH CHECK FAILED on https://expired.badssl.com/ with HTTP unknown status (Error)
HEALTH CHECK PASSED on https://badssl.com/ with HTTP 200
HEALTH CHECK PASSED on https://google.com with HTTP 200
```

## Schedule it

You can run the script from a scheduled (cron) pipeline.

E.g. (GitHub Actions):

```yml
name: monitoring
on:
  schedule:
    - cron: '20 23 * * *'
jobs:
  run-health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: Install project
        run: yarn
      - name: Run health check
        run: yarn simple-puppeteer-uptime-checker
```

# License

MIT License

Copyright (c) 2021 David Barton
