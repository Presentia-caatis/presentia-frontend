describe('Superadmin Add School Test', () => {
    const roles = ['superadmin'];
    //tc-42
    roles.forEach((role) => {
        it(`Cek perilaku ${role} dapat menambahkan data sekolah baru`, () => {
            cy.loginAs(role);

            cy.get('.layout-sidebar').contains('Daftar Sekolah').click();
            cy.contains('button', 'Sekolah Baru').should('be.visible').click();
            cy.get('.p-dialog').should('be.visible');
            cy.get('.p-dropdown').first().click({
                force: true
            });
            // cy.get('.p-dropdown-items > li').then($items => {
            //     const randomIndex = Math.floor(Math.random() * $items.length);
            //     cy.wrap($items[randomIndex]).click();
            // });
            // const randomSuffix = Math.floor(Math.random() * 10000);
            // const schoolName = `Sekolah Satu Test ${randomSuffix}`;
            // cy.get('input[placeholder="Masukkan nama sekolah"]').type(schoolName);
            // cy.get('textarea[placeholder="Masukkan alamat sekolah"]').type('Jalan Testing Frontend');
            // cy.get('input[type="file"]').selectFile('cypress/fixtures/logo.png', {
            //     force: true
            // });
            // cy.contains('button', 'Tambahkan').click();

            // // Verifikasi toast berhasil muncul
            // cy.get('.p-toast').should('be.visible');
            // cy.get('.p-toast-summary').should('contain.text', 'Sukses');
            // cy.get('.p-toast-detail').should('contain.text', 'Sekolah baru berhasil ditambahkan');
        });
    });
});