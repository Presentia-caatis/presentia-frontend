describe('Update Class Data Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} dapat memperbarui data kelas`, () => {
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

                cy.get('table thead tr').eq(1).within(() => {
                    cy.get('th').eq(1).find('input').clear().type('X TJKT');
                });

                cy.get('table tbody tr').should('have.length.greaterThan', 0).then($rows => {
                    const existingClassNames = Array.from($rows).map(row =>
                        row.querySelectorAll('td')[1].textContent.trim().toUpperCase()
                    );

                    const allPossibleNames = Array.from({ length: 20 }, (_, i) =>
                        `X TJKT ${String(i + 1).padStart(2, '0')}`
                    );

                    const availableNames = allPossibleNames.filter(name => !existingClassNames.includes(name));

                    if (availableNames.length === 0) {
                        cy.log('Tidak ada nama kelas baru yang tersedia.');
                        return;
                    }

                    const matchingIndices = [];
                    $rows.each((index, row) => {
                        const name = row.querySelectorAll('td')[1].textContent.trim().toUpperCase();
                        if (name.startsWith('X TJKT')) {
                            matchingIndices.push(index);
                        }
                    });

                    if (matchingIndices.length === 0) {
                        cy.log('Tidak ada kelas yang cocok untuk diupdate');
                        return;
                    }

                    const randomIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];

                    cy.get('table tbody tr').eq(randomIndex).within(() => {
                        cy.get('button.p-button-success').click();
                    });

                    cy.get('.p-dialog').should('be.visible');
                    cy.get('#className').should('be.visible').invoke('val').should('not.be.empty');

                    function tryUpdateWithNextName(index) {
                        if (index >= availableNames.length) {
                            throw new Error('Tidak ada nama kelas unik yang bisa digunakan.');
                        }

                        const newName = availableNames[index];
                        cy.get('#className').clear().type(newName);

                        cy.contains('button', 'Simpan').click();

                        cy.get('.p-confirm-popup').should('be.visible').within(() => {
                            cy.contains('button', 'Ya').click();
                        });

                        cy.get('.p-toast').should('be.visible');
                        cy.get('.p-toast-summary').invoke('text').then(summary => {
                            if (summary.includes('Sukses')) {
                                cy.contains('.p-toast-detail', /Berhasil memperbarui kelas .* menjadi .*!/).should('be.visible');
                            } else if (summary.includes('Gagal memperbarui kelas!')) {
                                cy.wait(500);
                                tryUpdateWithNextName(index + 1);
                            } else {
                                throw new Error('Tidak ada notifikasi hasil.');
                            }
                        });
                        cy.wait(1000);
                    }
                    tryUpdateWithNextName(0);
                });
            });
    });
});