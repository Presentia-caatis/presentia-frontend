describe('Total Presence Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['staf', 'admin', 'superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'staf' ? 'staf sekolah'
            : role === 'admin' ? 'admin sekolah'
                : 'superadmin'} melihat jumlah presensi siswa`, () => {

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

                        // cy.contains('h5', 'Data Kehadiran Hari Ini').should('be.visible');
                        // cy.get('.p-carousel-item:visible')
                        //     .should('have.length.greaterThan', 0)
                        //     .each(($item) => {
                        //         cy.wrap($item).within(() => {
                        //             cy.contains(/Total Hadir|Tidak Hadir|Tepat Waktu|Telat|On Time|Late|Absent/)
                        //                 .scrollIntoView({ block: 'center', inline: 'center' })
                        //                 .should('exist');

                        //             cy.get('div.text-900.font-bold')
                        //                 .scrollIntoView({ block: 'center', inline: 'center' })
                        //                 .invoke('text')
                        //                 .then((text) => {
                        //                     expect(text.trim()).to.match(/^\d+$/);
                        //                 });
                        //         });
                        //     });
                    });
                });
    });
});
