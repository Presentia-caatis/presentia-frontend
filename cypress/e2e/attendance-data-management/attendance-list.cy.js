describe('Attendance List Page Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} melihat daftar presensi siswa`, () => {
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
                    cy.get('.layout-sidebar').contains('Kehadiran Siswa').click();
                    cy.url().should('include', `/school/${school}/attendance`);

                    cy.get('.card').first().should('exist').and('be.visible');
                    cy.get('.card h1')
                        .should('contain.text', 'Kehadiran')
                        .invoke('text')
                        .should('match', /^Kehadiran\s+\S+/);

                    const filters = [
                        {
                            label: 'Pilih Tanggal Kehadiran',
                            elements: [
                                { selector: '#startDate input[placeholder="Tanggal Awal"]', shouldExist: true },
                                { selector: '#endDate input[placeholder="Tanggal Akhir"]', shouldExist: true }
                            ]
                        },
                        { label: 'Pilih Kelas', selector: '.p-multiselect' },
                        { label: 'Pilih Jenis Kehadiran / Ketidakhadiran', selector: '.p-multiselect' }
                    ];

                    filters.forEach((filter) => {
                        cy.contains('h5', filter.label).should('be.visible')
                            .parent().within(() => {
                                if (filter.elements) {
                                    filter.elements.forEach((el) => {
                                        cy.get(el.selector).should(el.shouldExist ? 'exist' : 'not.exist');
                                    });
                                } else {
                                    cy.get(filter.selector).should('exist');
                                }
                            });
                    });

                    cy.contains('h3', 'Tampilkan data kehadiran siswa')
                        .should('be.visible')
                        .then(() => {
                            cy.contains('button', 'Tampilkan')
                                .should('be.visible')
                                .and('not.be.disabled')
                        });

                    const buttons = [
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

                    cy.get('.card').eq(1).should('exist').and('be.visible');
                    cy.get('table').should('be.visible');
                    cy.contains('Memuat data kehadiran...').should('not.exist');
                    cy.get('h5')
                        .contains(/^Data kehadiran siswa/)
                        .should('be.visible')
                        .invoke('text')
                        .should('match', /^Data kehadiran siswa\s+\S+/);
                    cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');

                    const expectedHeaders = ["Nama", "NIS", "Kelamin", "Kelas", "Tanggal", "Waktu Masuk", "Waktu Pulang", "Status"];

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

                    cy.get('table tbody tr').then(($rows) => {
                        if ($rows.length === 1) {
                            cy.wrap($rows).first().within(() => {
                                cy.get('td')
                                    .invoke('text')
                                    .should('include', 'Belum ada data kehadiran');
                            });
                        } else {
                            expect($rows.length).to.be.greaterThan(1);

                            cy.wrap($rows).each(($row, rowIndex) => {
                                if (rowIndex === 0) return;

                                cy.wrap($row).within(() => {
                                    cy.get('td').each(($cell, colIndex, $cells) => {
                                        const textValue = $cell.text().trim();

                                        if (colIndex === 0) {
                                            cy.wrap($cell).find('input.p-checkbox-input').should('exist');
                                        } else if (colIndex === $cells.length - 1) {
                                            cy.wrap($cell).find('button.p-button-success').should('exist');
                                            cy.wrap($cell).find('button.p-button-danger').should('exist');
                                        } else {
                                            expect(textValue).not.to.be.empty;

                                            if (colIndex === 1) {
                                                expect(textValue).to.match(/\S+/);
                                            } else if (colIndex === 2) {
                                                expect(textValue).to.match(/^\d+$/);
                                            } else if (colIndex === 3) {
                                                expect(textValue).to.match(/^(Laki-laki|Perempuan)$/i);
                                            } else if (colIndex === 4) {
                                                expect(textValue).to.match(/\S+/);
                                            } else if (colIndex === 5) {
                                                if (!['', '-'].includes(textValue)) {
                                                    expect(textValue).to.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
                                                }
                                            } else if (colIndex === 6 || colIndex === 7) {
                                                if (!['', '-'].includes(textValue)) {
                                                    expect(textValue).to.match(/^\d{2}\.\d{2}\.\d{2}$/);
                                                }
                                            } else if (colIndex === 8) {
                                                expect(textValue).to.match(/^(On Time|Late|Absent)$/);

                                            }
                                        }
                                    });
                                });
                            });
                        }
                    });
                });
            });
    });
});