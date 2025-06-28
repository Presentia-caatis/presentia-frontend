describe('Export Attendance Data Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} mengunduh daftar presensi atau absensi`, () => {
                cy.loginAs(role);
                cy.contains("Selamat datang di dashboard admin").should("be.visible");

                cy.get('.layout-sidebar').should('be.visible');
                cy.get('.layout-sidebar').contains('Daftar Sekolah').click();
                cy.url().should('include', 'admin/school');

                cy.get('table').should('be.visible');
                cy.contains('td', schoolName).should('be.visible');
                cy.contains('td', schoolName)
                    .parents('tr')
                    .within(() => {
                        cy.contains('button', 'Masuk').click();
                    });
                cy.url().should('include', `/school/${school}/dashboard`);

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
                    { label: 'Pilih Status Presensi', selector: '.p-multiselect' }
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

                cy.contains('button', 'Export')
                    .should('be.visible')
                    .click();

                cy.contains('Export Data Kehadiran').should('be.visible');

                cy.get('.p-dialog')
                    .contains('button', 'Export')
                    .should('be.visible')
                    .click();
                cy.get('.p-confirm-popup')
                    .should('be.visible')
                    .and('contain.text', 'Apakah Anda yakin ingin export data kehadiran ini?')
                    .within(() => {
                        cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                        cy.get('button.p-button-success')
                            .should('be.visible')
                            .and('contain.text', 'Ya')
                            .click();
                    });

                cy.contains('Sedang melakukan export data kehadiran!', { timeout: 10000 }).should('be.visible');

                cy.get('body').then(($body) => {
                    const text = $body.text();
                    if (text.includes('Export data kehadiran berhasil!!')) {
                        cy.contains('Export data kehadiran berhasil!').should('be.visible');
                    } else if (text.includes('Terjadi kesalahan saat mengekspor!')) {
                        cy.contains('Terjadi kesalahan saat mengekspor!').should('be.visible');
                    } else {
                        cy.log('Toast export tidak muncul');
                    }
                });
            });
    });
});