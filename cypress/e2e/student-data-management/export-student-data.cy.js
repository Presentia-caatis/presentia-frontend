describe('Export Student Data Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['superadmin', 'admin', 'coadmin', 'staf'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role === 'admin' ? 'admin sekolah'
                : role === 'coadmin' ? 'co-admin sekolah'
                    : role === 'staf' ? 'staf sekolah'
                        : role} mengunduh data siswa`, () => {
                            cy.loginAs(role);
                            cy.contains("Sekolah yang dikelola").should("be.visible");

                            const buttons = [
                                { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah', url: `/school/${school}/dashboard` },
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

                                cy.contains('button', 'Export').click();
                                cy.contains('Sedang melakukan export data siswa!').should('be.visible');
                                cy.wait(2000);
                                cy.get('body').then(($body) => {
                                    const text = $body.text();
                                    if (text.includes('Export data siswa berhasil!')) {
                                        cy.contains('Export data siswa berhasil!').should('be.visible');
                                    } else if (text.includes('Terjadi kesalahan saat export data siswa.')) {
                                        cy.contains('Terjadi kesalahan saat export data siswa.').should('be.visible');
                                    } else {
                                        throw new Error('Tidak ada toast export');
                                    }
                                });
                            });
                        });
    });
});