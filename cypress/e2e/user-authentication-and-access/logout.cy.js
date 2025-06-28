describe('Logout Test', () => {
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} logout dari sistem`, () => {
                cy.loginAs(role);

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