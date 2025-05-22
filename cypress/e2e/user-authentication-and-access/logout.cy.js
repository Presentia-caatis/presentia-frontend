describe('Logout Test', () => {
    const roles = ['general_user', 'staf', 'admin', 'superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'general_user' ? 'pengguna umum'
            : role === 'staf' ? 'staf sekolah'
                : role === 'admin' ? 'admin sekolah'
                    : 'superadmin'} logout dari sistem`, () => {
                        cy.loginAs(role);
                        cy.contains("Sekolah yang dikelola").should("be.visible");

                        cy.get('.layout-topbar').should('be.visible');
                        cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
                        cy.get('.absolute.bg-white').should('be.visible');
                        cy.contains('Logout').click();
                        cy.get('.p-toast')
                            .should('be.visible')
                            .and('contain.text', 'Logout')
                            .and('contain.text', 'Sedang proses logout...');
                        cy.get('.p-toast')
                            .should('be.visible')
                            .and('contain.text', 'Logout Sukses')
                            .and('contain.text', 'Kamu berhasil logout');
                        cy.url().should('include', '/');
                    });
    });
});