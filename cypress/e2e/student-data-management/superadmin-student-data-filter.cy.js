describe('Filter Student Data Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} mencari data siswa menggunakan filter`, () => {
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
                cy.get('.layout-sidebar').contains('Daftar Siswa').click();
                cy.url().should('include', `/school/${school}/student`);

                cy.get('.card').first().should('exist').and('be.visible');
                cy.get('.card h1')
                    .should('contain.text', 'Daftar Siswa')
                    .invoke('text')
                    .should('match', /^Daftar Siswa\s+\S+/);

                cy.get('table').should('be.visible');
                cy.contains('Memuat data siswa...').should('not.exist');

                cy.get('.card h5')
                    .should('contain.text', 'Data Siswa')
                    .invoke('text')
                    .should('match', /^Data Siswa\s+\S+/);
                cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');

                cy.get('table thead tr').eq(1).within(() => {
                    cy.get('th').eq(1).find('input').clear().type('Siswa Sekolah');
                });

                cy.get('table thead tr').eq(1).within(() => {
                    cy.get('th').eq(4).find('.p-dropdown').should('be.visible').click();
                });
                cy.get('.p-dropdown-panel').should('be.visible');
                cy.get('.p-dropdown-panel .p-dropdown-item')
                    .contains('Perempuan')
                    .should('be.visible')
                    .click();
                cy.get('table tbody tr').should('have.length.greaterThan', 0);

                cy.wait(2000);
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).invoke('text').then((rowText) => {
                        if (rowText.includes('Tidak ada siswa yang sesuai dengan pencarian Anda')) {
                            return;
                        }

                        cy.wrap($row).find('td').eq(1)
                            .invoke('text')
                            .then((text) => {
                                const nama = text.trim().toUpperCase();
                                const filterInput = 'SISWA SEKOLAH';
                                expect(nama).to.include(filterInput);
                            });

                        cy.wrap($row).find('td').eq(4)
                            .invoke('text')
                            .then((text) => {
                                const gender = text.trim();
                                expect(gender.trim()).to.equal('Perempuan');
                            });
                    });
                });
            });
    });
});