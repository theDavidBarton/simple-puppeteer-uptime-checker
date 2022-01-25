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

const nodemailer = require('nodemailer');
const https = require('https');

/* You need to apply this on your gmail account: https://myaccount.google.com/lesssecureapps
 for required environment variables see docs: https://github.com/theDavidBarton/simple-puppeteer-uptime-checker#environment-variables */

const email = msg => {
  if (!process.env.GMAIL_ADDRESS || !process.env.GMAIL_PASSWORD || !process.env.NOTIFICATION_EMAIL_ADDRESS) {
    console.log('email environment variable is missing:\nhttps://github.com/theDavidBarton/simple-puppeteer-uptime-checker#environment-variables');
    process.exit(0);
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS, // <your-email>@gmail.com
      pass: process.env.GMAIL_PASSWORD // password for <your-email>@gmail.com
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to: process.env.NOTIFICATION_EMAIL_ADDRESS, // <notification-email>@<provider>
    subject: 'simple puppeteer uptime alert',
    text: msg
  };

  transporter.sendMail(mailOptions, (e, info) => {
    if (e) console.error(e);
    else console.log('email sent: ' + info.response);
  });
};

const slack = msg => {
  if (!process.env.WEBHOOKS_URL) {
    console.log('slack environment variable is missing:\nhttps://github.com/theDavidBarton/simple-puppeteer-uptime-checker#environment-variables');
    process.exit(0);
  }
  let postData;
  typeof(msg) === 'object' ? postData = JSON.stringify(msg) : postData = JSON.stringify({ text: msg });

  const slackOptions  = {
    method: 'POST',
    hostname: 'hooks.slack.com',
    path: process.env.WEBHOOKS_URL,
    headers: { 'Content-Type': 'text/plain' },
    maxRedirects: 4
  };

  const req = https.request(slackOptions , res => {
    const chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('error', e => console.error(e));
  });

  req.write(postData);
  req.end();
};

module.exports = { email, slack };
