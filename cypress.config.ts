import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://medisupply-alb-656658498.us-east-1.elb.amazonaws.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
