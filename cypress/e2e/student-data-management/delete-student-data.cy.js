describe('Delete Student Data Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['superadmin', 'admin', 'coadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role === 'admin' ? 'admin sekolah'
                : role === 'coadmin' ? 'co-admin sekolah'
                    : role} menghapus data siswa`, () => {
                        cy.loginAs(role);
                        cy.contains("Sekolah yang dikelola").should("be.visible");

                        const buttons = [
                            { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah', url: `school/${school}/dashboard` },
                        ];

                        buttons.forEach(({ selector, icon, text, url }) => {
                            cy.get(selector)
                                .should('be.visible')
                                .within(() => {
                                    cy.get(icon).should('be.visible');
                                    cy.contains(text).should('be.visible');
                                })
                                .click();
                            cy.url().should('include', url);

                            cy.get('.layout-sidebar').should('be.visible');
                            cy.get('.layout-sidebar').contains('Daftar Siswa').click();
                            cy.url().should('include', `/school/${school}/student`);

                            cy.get('.card').first().should('exist').and('be.visible');
                            cy.get('.card h1')
                                .should('contain.text', 'Daftar Siswa')
                                .invoke('text')
                                .should('match', /^Daftar Siswa\s+\S+/);

                            const buttons = [
                                { label: 'Siswa Baru', icon: '.pi.pi-plus', shouldBeDisabled: false },
                                { label: 'Import', icon: '.pi.pi-upload', shouldBeDisabled: false },
                                { label: 'Hapus', icon: '.pi.pi-trash', shouldBeDisabled: true },
                                { label: 'Export', icon: '.pi.pi-upload', shouldBeDisabled: false }
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
                            cy.contains('Memuat data siswa...').should('not.exist');
                            cy.get('.card h5')
                                .should('contain.text', 'Data Siswa')
                                .invoke('text')
                                .should('match', /^Data Siswa\s+\S+/);
                            cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');

                            cy.get('table thead tr').eq(1).within(() => {
                                cy.get('th').eq(1).find('input').clear().type('Siswa Sekolah');
                            });

                            cy.get('table tbody tr').first().should('have.length.greaterThan', 0).each(($row) => {
                                cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
                                    const nama = text.trim().toUpperCase();
                                    const filterInput = 'Siswa Sekolah'.toUpperCase();

                                    if (nama.includes(filterInput)) {
                                        cy.wrap($row).find('button.p-button-danger').should('exist').click();
                                        cy.get('.p-confirm-popup')
                                            .should('be.visible')
                                            .and('contain.text', 'Apakah Anda yakin ingin menghapus siswa ini?')
                                            .within(() => {
                                                cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                                                cy.get('button.p-button-danger')
                                                    .should('be.visible')
                                                    .and('contain.text', 'Ya')
                                                    .click();
                                            });

                                        cy.get('.p-toast')
                                            .should('be.visible')
                                            .and('contain.text', 'Menghapus siswa')
                                            .and('contain.text', 'Proses menghapus sedang berlangsung...');
                                        cy.get('.p-toast').should('be.visible');
                                        cy.contains('.p-toast-summary', 'Siswa berhasil dihapus').should('be.visible');
                                        cy.contains('.p-toast-detail', 'Data siswa telah dihapus.').should('be.visible');
                                    }
                                });
                            });
                        });
                    });
    });
});