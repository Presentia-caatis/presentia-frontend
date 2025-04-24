describe('Delete Class Data Test', () => {
    beforeEach(() => {
        cy.loginAs('coadmin');
    });

    it('Cek perilaku co-admin sekolah menghapus data kelas', () => {
        cy.contains("Sekolah yang dikelola", { timeout: 60000 }).should("be.visible");

        const buttons = [
            { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah', url: '/school/smkn-10-bandung/dashboard' },
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

            cy.get('.layout-sidebar', { timeout: 5000 }).should('be.visible');
            cy.get('.layout-sidebar').contains('Daftar Kelas').click();
            cy.url().should('include', '/school/smkn-10-bandung/classroom');

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
            cy.contains('Memuat data kelas...', { timeout: 40000 }).should('not.exist');

            cy.get('.card h5')
                .should('contain.text', 'Daftar Kelas')

            const expectedHeaders = ["Nama", "Jumlah Murid"];

            cy.get('table thead tr').first().within(() => {
                cy.get('th').each(($th, index, $ths) => {
                    if (index === 0) {
                        cy.wrap($th).should('have.class', 'p-selection-column');
                    } else if (index === $ths.length - 1) {
                        cy.wrap($th)
                            .invoke('text')
                            .then((text) => {
                                expect(text.trim()).to.be.empty;
                            });
                    } else {
                        cy.wrap($th)
                            .invoke('text')
                            .then((text) => {
                                expect(text.trim()).to.equal(expectedHeaders[index - 1]);
                            });
                    }
                });
            });

            cy.get('table thead tr').eq(1).within(() => {
                cy.get('th').each(($th, index) => {
                    if (index === 0) {
                        cy.wrap($th).find('input.p-checkbox-input').should('exist');
                    } else if (index === 1) {
                        cy.wrap($th).find('input').should('exist');
                    } else if (index === 2) {
                        cy.wrap($th).should('be.empty');
                    }
                });
            });

            cy.get('table thead tr').eq(1).within(() => {
                cy.get('th').eq(1).find('input').clear().type('SE-45');
            });

            cy.wait(20000);

            cy.get('table tbody tr').first().should('have.length.greaterThan', 0).each(($row) => {
                cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
                    const nama = text.trim().toUpperCase();
                    const filterInput = 'SE-45'.toUpperCase();

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

                        cy.get('.p-toast', { timeout: 15000 }).should('be.visible');
                        cy.contains('.p-toast-summary', 'Menghapus...').should('be.visible');

                        cy.get('.p-toast-detail')
                            .should('be.visible')
                            .invoke('text')
                            .then((toastText) => {
                                expect(toastText).to.match(/Menghapus kelas .+/);
                            });


                        cy.wait(5000);

                        cy.get('.p-toast', { timeout: 15000 }).should('be.visible');
                        cy.contains('.p-toast-summary', 'Berhasil').should('be.visible');

                        cy.get('.p-toast-detail')
                            .should('be.visible')
                            .invoke('text')
                            .then((toastText) => {
                                expect(toastText).to.match(/Kelas .+ telah dihapus!/);
                            });
                    }
                });
            });
        });
    });
});