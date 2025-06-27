describe('Add Class Data Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} dapat menambahkan data kelas`, () => {
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
                cy.get('.layout-sidebar').contains('Daftar Kelas').click();
                cy.url().should('include', `/school/${school}/classroom`);

                cy.get('.card').first().should('exist').and('be.visible');
                cy.get('.card h1')
                    .should('contain.text', 'Daftar Kelas')
                    .invoke('text')
                    .should('match', /^Daftar Kelas\s+\S+/);

                const buttons = [
                    { label: 'Kelas Baru', icon: '.pi.pi-plus', shouldBeDisabled: false },
                    { label: 'Hapus', icon: '.pi.pi-trash', shouldBeDisabled: true },
                ];

                buttons.forEach(({ label, icon, shouldBeDisabled }) => {
                    cy.contains('button', label)
                        .should('be.visible')
                        .within(() => {
                            cy.get(icon).should('be.visible');
                        });

                    if (shouldBeDisabled !== undefined) {
                        cy.contains('button', label).should(shouldBeDisabled ? 'be.disabled' : 'not.be.disabled');
                    }
                });

                cy.get('table').should('be.visible');
                cy.contains('Memuat data kelas...').should('not.exist');
                cy.get('.card h5').should('contain.text', 'Daftar Kelas')

                const existingClassNames = [];

                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
                        const namaKelas = text.trim().toUpperCase();
                        existingClassNames.push(namaKelas);
                    });
                }).then(() => {
                    const allClassNames = Array.from({ length: 20 }, (_, i) =>
                        `X TJKT ${String(i + 1).padStart(2, '0')}`
                    );

                    const missingClass = allClassNames.find(kelas => !existingClassNames.includes(kelas));

                    if (missingClass) {
                        cy.contains('Kelas Baru').click();
                        cy.get('.p-dialog').should('be.visible');
                        cy.get('.p-dialog .p-dialog-title').should('have.text', 'Tambah Kelas Baru');

                        cy.get('input#className').clear().type(missingClass);

                        cy.get('button.p-button-text').contains('Simpan').should('exist').click();
                        cy.get('.p-confirm-popup')
                            .should('be.visible')
                            .and('contain.text', 'Apakah Anda yakin ingin menambahkan kelas ini?')
                            .within(() => {
                                cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                                cy.get('button.p-button-success')
                                    .should('be.visible')
                                    .and('contain.text', 'Ya')
                                    .click();
                            });

                        cy.get('.p-toast').should('be.visible');
                        cy.get('.p-toast-summary', 'Sukses').should('be.visible');
                        cy.get('.p-toast-detail')
                            .should('be.visible')
                            .invoke('text')
                            .should('match', /Berhasil membuat kelas baru .+!/);
                        cy.wait(1000);
                    }
                });
            });
    });
});