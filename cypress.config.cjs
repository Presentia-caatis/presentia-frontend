module.exports = {
  e2e: {
    baseUrl: "http://localhost:5173/",
    supportFile: false,
    setupNodeEvents(on, config) {
      // Event listener for Cypress
    },
    specPattern: "cypress/**/*.cy.js",
  },
};
