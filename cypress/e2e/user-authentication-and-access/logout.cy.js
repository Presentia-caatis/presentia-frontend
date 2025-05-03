describe('Logout From User Dashboard Test', () => {
    const roles = ['superadmin', 'admin', 'coadmin', 'staf', 'general_user'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role === 'admin' ? 'admin sekolah'
                : role === 'coadmin' ? 'co-admin sekolah'
                    : role === 'staf' ? 'staf sekolah'
                        : role === 'general_user' ? 'pengguna umum'
                            : role} logout dari sistem`, () => {
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