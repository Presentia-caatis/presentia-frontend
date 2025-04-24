module.exports = {
  e2e: {
    baseUrl: "http://localhost:8080/",
    supportFile: false,
    setupNodeEvents(on, config) {
      // Event listener for Cypress
    },
    specPattern: "cypress/**/*.cy.js",
    supportFile: 'cypress/support/e2e.js',
  },
};