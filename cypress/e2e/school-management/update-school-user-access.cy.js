describe("Update School user access Test", () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];
    //tc-32
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin'
            : role
            }
            dapat melihat daftar staff dan admin sekolah dan mencabut hak akses nya.
            `, () => {
            cy.loginAs(role);
            cy.contains("Sekolah yang dikelola").should("be.visible");
            const buttons = [{
                selector: 'button.p-button-primary',
                icon: '.pi.pi-home',
                text: 'Dashboard Sekolah',
                // url: `/school/${school}/dashboard`
            }, ];

            buttons.forEach(({
                selector,
                icon,
                text,
                url
            }) => {
                cy.get(selector)
                    .should('be.visible')
                    .within(() => {
                        cy.get(icon).should('be.visible');
                        cy.contains(text).should('be.visible');
                    })
                    .click();
                // cy.url().should('include', url);

                cy.get(".layout-sidebar").should("be.visible");
                cy.get(".layout-sidebar").contains("Daftar Pengguna").click();
                // cy.url().should("include", `/school/${school}/fingerprint`);
            });
        });
    });
});