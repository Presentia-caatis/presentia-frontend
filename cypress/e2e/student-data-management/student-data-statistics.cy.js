describe('Student Data Statistics Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['superadmin', 'admin', 'coadmin', 'staf'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role === 'admin' ? 'admin sekolah'
                : role === 'coadmin' ? 'co-admin sekolah'
                    : role === 'staf' ? 'staf sekolah'
                        : role} melihat statistik data siswa`, () => {
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

                                const studentAttendanceChart = [
                                    { title: 'Perbandingan Kehadiran Hari Ini', noDataText: 'Tidak Ada Kehadiran Hari Ini' },
                                    { title: 'Statistik Kehadiran Harian', noDataText: 'Tidak Ada Data Kehadiran' },
                                    { title: 'Perbandingan Status Siswa' },
                                    { title: 'Perbandingan Jenis Kelamin Siswa' }
                                ];

                                studentAttendanceChart.forEach(({ title, noDataText }) => {
                                    cy.contains('h5', title).should('be.visible').parent().within(() => {
                                        cy.get('canvas').then($canvas => {
                                            if ($canvas.length > 0) {
                                                cy.wrap($canvas).should('exist').and('be.visible');
                                            } else if (noDataText) {
                                                cy.contains(noDataText).should('be.visible');
                                            }
                                        });
                                    });
                                });
                            });
                        });
    });
});