describe('Failed to Update Class Data Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} tidak dapat memperbarui data kelas`, () => {
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

                    const classNames = [];

                    cy.get('table tbody tr').each(($row, index) => {
                        cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
                            classNames.push({ name: text.trim(), index });
                        });
                    }).then(() => {
                        if (classNames.length < 2) {
                            throw new Error('Minimal harus ada dua kelas untuk uji duplikat');
                        }

                        const shuffled = classNames.sort(() => 0.5 - Math.random());
                        const targetClass = shuffled[0];
                        const duplicateName = shuffled[1].name;

                        cy.get('table tbody tr').eq(targetClass.index).within(() => {
                            cy.get('button.p-button-success').click();
                        });

                        cy.get('.p-dialog').should('be.visible');
                        cy.get('#className').clear().type(duplicateName);

                        cy.contains('button', 'Simpan').click();
                        cy.get('.p-confirm-popup')
                            .should('be.visible')
                            .within(() => {
                                cy.contains('button', 'Ya').click();
                            });

                        cy.get('.p-toast').should('be.visible');
                        cy.get('.p-toast-summary').should('contain.text', 'Error');
                        cy.get('.p-toast-detail').should('contain.text', 'Gagal memperbarui kelas!');
                    });
                });
            });
    });
});