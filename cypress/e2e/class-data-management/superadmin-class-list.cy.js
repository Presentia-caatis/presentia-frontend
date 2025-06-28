describe('Class List Page Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} melihat data kelas`, () => {
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
                cy.get('.card h5').should('contain.text', 'Daftar Kelas');

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

                cy.get('table tbody tr').should('have.length.greaterThan', 0).each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').each(($cell, colIndex, $cells) => {
                            const isLast = colIndex === $cells.length - 1;

                            if (colIndex === 0) {
                                cy.wrap($cell).find('input.p-checkbox-input').should('exist');
                            } else if (isLast) {
                                cy.wrap($cell).find('button.p-button-info').should('exist');
                                cy.wrap($cell).find('button.p-button-success').should('exist');
                                cy.wrap($cell).find('button.p-button-danger').should('exist');
                            } else {
                                cy.wrap($cell).invoke('text').then((text) => {
                                    const trimmed = text.trim();
                                    expect(trimmed).not.to.be.empty;

                                    if (colIndex === 1) {
                                        expect(trimmed).to.match(/\S+/);
                                    } else if (colIndex === 2) {
                                        expect(trimmed).to.match(/^\d+$/);
                                    }
                                });
                            }
                        });
                    });
                });
            });
    });
});