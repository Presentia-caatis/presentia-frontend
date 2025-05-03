describe('Delete Class Data Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['superadmin', 'admin', 'coadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role === 'admin' ? 'admin sekolah'
                : role === 'coadmin' ? 'co-admin sekolah'
                    : role} menghapus data kelas`, () => {
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

                            cy.get('.card h5').should('contain.text', 'Daftar Kelas');

                            cy.get('table thead tr').eq(1).within(() => {
                                cy.get('th').eq(1).find('input').clear().type('X TJKT');
                            });

                            cy.get('table tbody tr').first().should('have.length.greaterThan', 0).each(($row) => {
                                cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
                                    const nama = text.trim().toUpperCase();
                                    const filterInput = 'X TJKT'.toUpperCase();

                                    if (nama.includes(filterInput)) {
                                        cy.wrap($row).find('button.p-button-danger').should('exist').click();
                                        cy.get('.p-confirm-popup')
                                            .should('be.visible')
                                            .invoke('text')
                                            .then((text) => {
                                                expect(text).to.match(/Apakah Anda yakin ingin menghapus kelas ".+"\?/);
                                            })
                                            .get('.p-confirm-popup')
                                            .within(() => {
                                                cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                                                cy.get('button.p-button-danger')
                                                    .should('be.visible')
                                                    .and('contain.text', 'Ya')
                                                    .click();
                                            });

                                        cy.get('.p-toast').should('be.visible');
                                        cy.contains('.p-toast-summary', 'Menghapus...').should('be.visible');

                                        cy.get('.p-toast-detail')
                                            .should('be.visible')
                                            .invoke('text')
                                            .then((toastText) => {
                                                expect(toastText).to.match(/Menghapus kelas .+/);
                                            });

                                        cy.get('.p-toast').should('be.visible');
                                        cy.get('.p-toast-summary')
                                            .should('be.visible')
                                            .invoke('text')
                                            .then((summaryText) => {
                                                if (summaryText.includes('Sukses')) {
                                                    cy.get('.p-toast-detail')
                                                        .should('be.visible')
                                                        .invoke('text')
                                                        .then((toastText) => {
                                                            expect(toastText).to.match(/Kelas .+ telah dihapus!/);
                                                        });
                                                } else if (summaryText.includes('Gagal')) {
                                                    cy.get('.p-toast-detail')
                                                        .should('be.visible')
                                                        .invoke('text')
                                                        .then((toastText) => {
                                                            expect(toastText).to.equal('Gagal menghapus kelas');
                                                        });
                                                } else {
                                                    throw new Error('Tidak ada toast');
                                                }
                                            });
                                    }
                                });
                            });
                        });
                    });
    });
});