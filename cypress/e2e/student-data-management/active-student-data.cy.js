describe('Active Student Data Test', () => {
    const roles = ['admin', 'superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : 'superadmin'} melihat jumlah siswa aktif`, () => {
                cy.loginAs(role);
                cy.contains("Sekolah yang dikelola").should("be.visible");

                const schoolData = [
                    { selector: 'img', assertion: 'be.visible' },
                    { selector: 'h1.text-4xl', assertion: 'exist' },
                    { icon: '.pi.pi-map-marker', label: 'Alamat:' },
                    { icon: '.pi.pi-calendar', label: 'Terdaftar Sejak:' },
                    { icon: '.pi.pi-calendar-times', label: 'Terakhir Berlangganan:' },
                    { icon: '.pi.pi-box', label: 'Berlangganan:' }
                ];

                schoolData.forEach(({ selector, assertion, icon, label }) => {
                    if (selector) {
                        cy.get(selector).should(assertion);
                    } else if (icon && label) {
                        cy.get(icon)
                            .should('be.visible')
                            .parent()
                            .within(() => {
                                cy.contains(label).should('exist')
                                    .next().invoke('text')
                                    .should('not.be.empty')
                                    .and('not.contain', 'undefined')
                                    .and('not.contain', 'null');
                            });
                    }
                });

                const attendanceData = [
                    { icon: '.pi.pi-users', label: 'Jumlah siswa aktif' },
                    { icon: '.pi.pi-address-book', label: 'Jumlah presensi hari ini' },
                    { icon: '.pi.pi-user-minus', label: 'Jumlah absensi hari ini' }
                ];

                attendanceData.forEach(({ icon, label }) => {
                    cy.get(icon)
                        .closest('.p-card')
                        .within(() => {
                            cy.contains(label).should('exist');
                            cy.get('p.text-3xl.font-bold')
                                .invoke('text')
                                .should('not.be.empty')
                                .and('not.match', /(undefined|null)/)
                                .and('match', /\d+/);
                        });
                });
            });
    });
});