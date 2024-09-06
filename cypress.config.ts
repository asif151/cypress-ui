import { defineConfig } from "cypress";

export default defineConfig({
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
        reportDir: 'cypress/reports',
        charts: true,
        reportFilename: 'TestReport',
        reportPageTitle: 'My Test Report',
        embeddedScreenshots: true,
        inlineAssets: true, // Includes images in the report
        saveAllAttempts: false,
        overwrite: false,
        html: false,
        json: true,
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: false,
    video: false,
    defaultCommandTimeout: 50000,
    projectId: "w7k121",
    responseTimeout: 10000,
    numTestsKeptInMemory: 10,
    experimentalMemoryManagement: true,
    chromeWebSecurity: false,
    env: {
        users: {
            cypressUser: {
                username: "standard_user",
                password: "secret_sauce",
            },
        },
    },
    e2e: {
        setupNodeEvents(on, config) {
            // Adding Mochawesome plugin
            require('cypress-mochawesome-reporter/plugin')(on);

            // Cypress terminal report
            require("cypress-terminal-report/src/installLogsPrinter")(on);

            // Return the config
            return config;
        },
        baseUrl: "https://www.saucedemo.com/v1/",
        specPattern: ['cypress/e2e/**/*.ts', 'cypress/e2e-ui-tests/**/*.ts'],
        supportFile: 'cypress/support/e2e.ts', // Ensure the support file exists
    },
});