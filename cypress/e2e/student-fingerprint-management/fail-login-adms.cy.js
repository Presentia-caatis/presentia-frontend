describe('Failed to Login ADMS Page Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} tidak dapat login ADMS`, () => {
                cy.loginAs(role);
                cy.contains("Sekolah yang dikelola").should("be.visible");
                const buttons = [
                    { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah', url: `/school/${school}/dashboard` },
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

                    cy.get('.layout-sidebar').should('be.visible');
                    cy.get('.layout-sidebar').contains('Daftar Sidik Jari').click();
                    cy.url().should('include', `/school/${school}/fingerprint`);

                    cy.get('.card h1').should('contain.text', 'Login untuk mendaftaran Sidik Jari');
                    cy.get('label').contains('Username').parent().find('input').type('presentiaadms');
                    cy.get('label').contains('Password').parent().find('input').type('PresentiaPwd');

                    cy.contains('button', 'Login')
                        .should('be.visible')
                        .and('not.be.disabled')
                        .click();
                    cy.get('.p-toast-message')
                        .should('contain.text', 'Login Gagal')
                        .and('contain.text', 'Periksa kembali kredensial Anda.')
                        .and('be.visible');
                });
            });
    });
});