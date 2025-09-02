describe('Superadmin list school Page Test', () => {
    const roles = ['superadmin'];
    //tc-41
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role
            }
            dapat melihat data sekolah yang terdaftar  `, () => {
            cy.loginAs(role);
            cy.contains("Selamat datang di dashboard admin").should("be.visible");
            cy.get('.layout-sidebar')
                .contains('Daftar Sekolah')
                .should('be.visible')
                .click();

        });
    });
});