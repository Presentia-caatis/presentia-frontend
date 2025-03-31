describe('Add Class Data Test', () => {
    beforeEach(() => {
        cy.loginAs('tester');
    });

    it('Cek perilaku user menambahkan data kelas', () => {
        cy.contains("Sekolah yang dikelola", { timeout: 50000 }).should("be.visible");

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

            cy.get('table tbody tr').then(($rows) => {
                expect($rows).to.have.length.greaterThan(0);

                cy.wrap($rows).each(($row, rowIndex) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').each(($cell, colIndex, $cells) => {
                            if (colIndex === 0) {
                                cy.wrap($cell).find('input.p-checkbox-input').should('exist');
                            } else if (colIndex === $cells.length - 1) {
                                cy.wrap($cell).find('button.p-button-info').should('exist');
                                cy.wrap($cell).find('button.p-button-success').should('exist');
                                cy.wrap($cell).find('button.p-button-danger').should('exist');
                            } else {
                                cy.wrap($cell)
                                    .invoke('text')
                                    .then((textValue) => {
                                        textValue = textValue.trim();
                                        expect(textValue).not.to.be.empty;

                                        cy.wrap(null).then(() => {
                                            if (colIndex === 1) {
                                                expect(textValue).to.match(/\S+/);
                                            } else if (colIndex === 2) {
                                                expect(textValue).to.match(/^\d+$/);
                                            }
                                        });
                                    });
                            }
                        });
                    });
                });
            });

            cy.contains('Kelas Baru').click();
            cy.get('.p-dialog').should('be.visible');

            cy.get('.p-dialog .p-dialog-title').should('have.text', 'Tambah Kelas Baru');

            const labels = ['Nama'];

            labels.forEach(label => {
                cy.contains('label', label).should('be.visible');
            });

            cy.get('input#className').type('SE-45-01');

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

            cy.wait(5000);

            cy.get('.p-toast', { timeout: 15000 }).should('be.visible');
            cy.contains('.p-toast-summary', 'Sukses').should('be.visible');
            cy.get('.p-toast-detail')
                .should('be.visible')
                .invoke('text')
                .then((toastText) => {
                    expect(toastText).to.match(/Berhasil membuat kelas baru \S+!/);
                });
        });
    });
});