jest.setTimeout(30000);

const simpleUptimeCheck = require('./src/index');

describe('Simple Puppeteer Uptime Checker', () => {
  test('should run without error', async () => {
    // notificationType: '--none'[default], '--all', '--slack', '--email'
    const promise = await simpleUptimeCheck();
    expect(promise).toBeTruthy();
  });
});
