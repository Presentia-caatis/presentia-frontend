const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: "http://localhost:8080/",
    supportFile: 'cypress/support/e2e.js',
    specPattern: "cypress/**/*.cy.js",
    setupNodeEvents(on, config) {
      // Event listener for Cypress, seperti plugin atau logging custom bisa ditambahkan di sini
    },
  },
});