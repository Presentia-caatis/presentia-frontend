describe('Add Class Data Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['superadmin', 'admin', 'coadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role === 'admin' ? 'admin sekolah'
                : role === 'coadmin' ? 'co-admin sekolah'
                    : role} menambahkan data kelas`, () => {
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

                            cy.contains('Kelas Baru').click();
                            cy.get('.p-dialog').should('be.visible');
                            cy.get('.p-dialog .p-dialog-title').should('have.text', 'Tambah Kelas Baru');

                            const labels = ['Nama'];

                            labels.forEach(label => {
                                cy.contains('label', label).should('be.visible');
                            });

                            const randomTwoDigit = String(Math.floor(Math.random() * 15) + 1).padStart(2, '0');
                            const generatedClassName = `X TJKT ${randomTwoDigit}`;
                            cy.get('input#className').type(generatedClassName);

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
                            cy.get('.p-toast-summary')
                                .should('be.visible')
                                .invoke('text')
                                .then((summaryText) => {
                                    if (summaryText.includes('Sukses')) {
                                        cy.get('.p-toast-detail')
                                            .should('be.visible')
                                            .invoke('text')
                                            .then((detailText) => {
                                                expect(detailText).to.match(/Berhasil membuat kelas baru .+!/);
                                            });
                                    } else if (summaryText.includes('Gagal menambahkan kelas')) {
                                        cy.get('.p-toast-detail')
                                            .should('be.visible')
                                            .invoke('text')
                                            .then((detailText) => {
                                                expect(detailText).to.include('Nama kelas tidak boleh sama dengan yang sudah terdaftar');
                                            });
                                    } else {
                                        throw new Error('Tidak ada toast');
                                    }
                                });
                        });
                    });
    });
});