describe('Attendance Data Statistics Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'ssuperadmin'
            : role} melihat statistik data presensi`, () => {
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

                const studentAttendanceChart = [
                    { title: 'Perbandingan Kehadiran Hari Ini', noDataText: 'Tidak Ada Kehadiran Hari Ini' },
                    { title: 'Statistik Kehadiran Harian', noDataText: 'Tidak Ada Data Kehadiran' },
                    { title: 'Perbandingan Status Siswa' },
                    { title: 'Perbandingan Jenis Kelamin Siswa' }
                ];

                studentAttendanceChart.forEach(({ title, noDataText }) => {
                    cy.contains('h5', title).should('be.visible').then($title => {
                        const card = $title.closest('.card');
                        cy.wrap(card).then($card => {
                            const canvas = $card.find('canvas');
                            if (canvas.length === 0 || !canvas.is(':visible')) {
                                if (noDataText) {
                                    cy.wrap($card).contains(noDataText).should('be.visible');
                                }
                            } else {
                                cy.wrap(canvas).should('be.visible');
                            }
                        });
                    });
                });
                cy.wait(1000);
            });
    });
});