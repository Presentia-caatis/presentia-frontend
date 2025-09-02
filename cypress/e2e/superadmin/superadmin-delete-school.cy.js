describe('Superadmin Delete School Test', () => {
    const roles = ['superadmin'];
    //tc-44
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role
            }
            dapat menghapus data sekolah yang terdaftar  `, () => {
            cy.loginAs(role);
            cy.contains("Selamat datang di dashboard admin").should("be.visible");
            cy.get('.layout-sidebar')
                .contains('Daftar Sekolah')
                .should('be.visible')
                .then(($el) => {
                    cy.wrap($el).click();
                });


        });
    });
});