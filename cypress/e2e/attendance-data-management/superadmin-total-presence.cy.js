describe('Total Presence Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} melihat jumlah presensi siswa`, () => {
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

                cy.get('h1')
                    .should('be.visible')
                    .invoke('text')
                    .should('match', /Selamat Datang di Dashboard .+/);

                cy.get('p')
                    .should('be.visible')
                    .invoke('text')
                    .should('not.be.empty')
                    .and('not.match', /(undefined|null)/);

                const todayRegex = /\d{1,2} \w+ \d{4}/;
                
                cy.get('h3')
                    .should('be.visible')
                    .invoke('text')
                    .should('match', todayRegex);

                const attendanceAndSubscription = [
                    { icon: '.pi.pi-users', label: 'Total Hadir Hari Ini', isNumber: true },
                    { icon: '.pi.pi-map-marker', label: 'Total Absen Hari Ini', isNumber: true },
                    { icon: '.pi.pi-check-circle', label: 'Paket Aktif', isNumber: false },
                    { label: 'Berlaku hingga:', isDate: true }
                ];

                attendanceAndSubscription.forEach(({ icon, label, isNumber, isDate }) => {
                    if (icon) {
                        cy.get(icon)
                            .should('be.visible')
                            .parents('.card')
                            .within(() => {
                                cy.contains(label)
                                    .should('exist')
                                    .next()
                                    .invoke('text')
                                    .should('not.be.empty')
                                    .and('not.match', /(undefined|null)/);

                                if (isNumber) {
                                    cy.contains(label).next().invoke('text').should('match', /\d+/);
                                }

                                if (isDate) {
                                    cy.contains(label).next().invoke('text')
                                        .should('match', /\d{1,2} \w+ \d{4}( pukul \d{2}\.\d{2}\.\d{2})?/);
                                }
                            });
                    }
                });
            });
    });
});