describe('Search Student Data Test', () => {
    beforeEach(() => {
        cy.loginAs('superadmin');
    });

    it('Cek perilaku superadmin mencari data siswa', () => {
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
            cy.get('.layout-sidebar').contains('Daftar Siswa').click();
            cy.url().should('include', '/school/smkn-10-bandung/student');

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
            cy.contains('Memuat data siswa...', { timeout: 40000 }).should('not.exist');

            cy.get('.card h5')
                .should('contain.text', 'Data Siswa')
                .invoke('text')
                .should('match', /^Data Siswa\s+\S+/);

            cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');

            const expectedHeaders = ["Nama", "NIS", "NISN", "Jenis Kelamin", "Kelas", "Status"];

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
                    } else if (index === 7) {
                        cy.wrap($th).should('be.empty');
                    } else if ([1, 2, 3].includes(index)) {
                        cy.wrap($th).find('input').should('exist');
                    } else if ([4, 5, 6].includes(index)) {
                        cy.wrap($th).find('select').should('exist');
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
                                            } else if (colIndex === 3) {
                                                expect(textValue).to.match(/^\d+$/);
                                            } else if (colIndex === 4) {
                                                expect(textValue).to.match(/^(Laki-Laki|Perempuan)$/);
                                            } else if (colIndex === 5) {
                                                expect(textValue).to.match(/\S+/);
                                            } else if (colIndex === 6) {
                                                expect(textValue).to.match(/^(Aktif|Tidak Aktif)$/);
                                            }
                                        });
                                    });
                            }
                        });
                    });
                });

                cy.get('.p-input-icon-left input[placeholder="Search..."]')
                    .clear()
                    .type('Putri');

                cy.contains('Memuat data siswa...').should('exist');
                cy.wait(20000);

                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).find('td').eq(1).invoke('text').then(text => {
                        const uppercasedText = text.trim().toUpperCase();
                        expect(text.trim()).to.equal(uppercasedText);
                        expect(uppercasedText).to.include('PUTRI');
                    });
                });
            });
        });
    });
});