#!/usr/bin/env node
const simpleUptimeCheck = require('./index');
(async () => {
  await simpleUptimeCheck();
  console.log('\nCLI uptime check finished');
})();
