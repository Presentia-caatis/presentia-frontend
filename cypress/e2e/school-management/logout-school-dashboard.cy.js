describe('Logout School Dashboard Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} logout dari dashboard sekolah`, () => {
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

                    cy.get('h1')
                        .should('be.visible')
                        .invoke('text')
                        .should('match', /Selamat Datang di Dashboard .+/);

                    cy.get('.layout-topbar').should('be.visible');
                    cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
                    cy.get('.absolute.bg-white').should('be.visible');
                    cy.contains('Keluar Dashboard Sekolah').click();
                    cy.url().should('include', '/user/dashboard');
                });
            });
    });
});