describe('Student Data Statistics Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['staf', 'admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'staf' ? 'staf sekolah'
            : role === 'admin' ? 'admin sekolah'
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
});