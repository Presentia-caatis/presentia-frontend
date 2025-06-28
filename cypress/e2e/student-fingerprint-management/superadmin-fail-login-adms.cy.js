describe('Failed to Login ADMS Page Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} tidak dapat login ADMS`, () => {
                cy.loginAs(role);
                cy.contains("Selamat datang di dashboard admin").should("be.visible");

                cy.get('.layout-sidebar').should('be.visible');
                cy.get('.layout-sidebar').contains('Daftar Sekolah').click();
                cy.url().should('include', '/admin/school');

                cy.get('table').should('be.visible');
                cy.contains('td', schoolName).should('be.visible');
                cy.contains('td', schoolName)
                    .parents('tr')
                    .within(() => {
                        cy.contains('button', 'Masuk').click();
                    });
                cy.url().should('include', `/school/${school}/dashboard`);

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