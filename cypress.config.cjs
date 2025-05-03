module.exports = {
  e2e: {
    baseUrl: "https://presentia.matradipti.org/",
    supportFile: false,
    setupNodeEvents(on, config) {
      // Event listener for Cypress
    },
    specPattern: "cypress/**/*.cy.js",
    supportFile: 'cypress/support/e2e.js',
    env: {
      schoolName: 'smk-telkom-bandung'
    }
  },
};