describe('Login ADMS Page Test', () => {
  beforeEach(() => {
    cy.loginAs('superadmin');
  });

  it('Cek perilaku superadmin login ADMS', () => {
    cy.contains("Sekolah yang dikelola", { timeout: 60000 }).should("be.visible");

    const buttons = [
      { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah', url: '/school/smkn-10-bandung/dashboard' },
    ];

    buttons.forEach(({ selector, icon, text, url }) => {
      cy.get(selector)
        .should('be.visible')
        .within(() => {
          cy.get(icon).should('be.visible');
          cy.contains(text).should('be.visible');
        })
        .click();

      cy.url().should('include', url);

      cy.get('.layout-sidebar', { timeout: 5000 }).should('be.visible');
      cy.get('.layout-sidebar').contains('Daftar Sidik Jari').click();
      cy.url().should('include', '/school/smkn-10-bandung/fingerprint');

      cy.get('.card h1').should('contain.text', 'Login untuk mendaftaran Sidik Jari');

      cy.readFile('cypress.env.json').then((data) => {
        const username = Cypress.env('ADMS_USERNAME') || data.users.adms.username;
        const password = Cypress.env('ADMS_PASSWORD') || data.users.adms.password;

        cy.get('label').contains('Username').parent().find('input').type(username);
        cy.get('label').contains('Password').parent().find('input').type(password);
        cy.contains('button', 'Login')
          .should('be.visible')
          .and('not.be.disabled')
          .click();
        cy.url().should('include', '/school/smkn-10-bandung/fingerprint');
      });
    });
  });
});