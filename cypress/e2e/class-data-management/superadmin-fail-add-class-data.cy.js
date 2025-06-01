describe('Failed to Add Class Data Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} tidak dapat menambahkan data kelas`, () => {
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

                cy.get('.card h5')
                    .should('contain.text', 'Daftar Kelas')

                const classNames = [];
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
                        classNames.push(text.trim());
                    });
                }).then(() => {
                    const randomClassName = classNames[Math.floor(Math.random() * classNames.length)];

                    cy.contains('button', 'Kelas Baru').click();
                    cy.get('.p-dialog').should('be.visible');
                    cy.get('.p-dialog .p-dialog-title').should('have.text', 'Tambah Kelas Baru');
                    cy.get('input#className').clear().type(randomClassName);

                    cy.get('button.p-button-text').contains('Simpan').click();
                    cy.get('.p-confirm-popup')
                        .should('be.visible')
                        .and('contain.text', 'Apakah Anda yakin ingin menambahkan kelas ini?')
                        .within(() => {
                            cy.get('button.p-button-success').contains('Ya').click();
                        });

                    cy.get('.p-toast').should('be.visible');
                    cy.get('.p-toast-summary').should('contain.text', 'Gagal menambahkan kelas');
                    cy.get('.p-toast-detail').should('contain.text', 'Nama kelas tidak boleh sama dengan yang sudah terdaftar');
                });
            });
    });
});