describe("Attendance Time Configuration Test", () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin', 'superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : 'superadmin'} mengonfigurasi waktu presensi siswa`, () => {
                cy.loginAs(role);
                cy.contains("Sekolah yang dikelola").should("be.visible");

                const buttons = [
                    { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah', url: `/school/${school}/dashboard` },
                ];

                buttons.forEach(({ selector, icon, text, url }) => {
                    cy.get(selector)
                        .should("be.visible")
                        .within(() => {
                            cy.get(icon).should("be.visible");
                            cy.contains(text).should("be.visible");
                        })
                        .click();
                    cy.url().should("include", url);

                    cy.get(".layout-sidebar").should("be.visible");
                    cy.get(".layout-sidebar").contains("Konfigurasi Waktu Presensi").click();
                    cy.url().should("include", `/school/${school}/default-attendance-time`);

                    const attendancePageElements = [
                        { selector: 'h1', text: 'Konfigurasi Waktu Presensi' },
                        { selector: 'label', text: 'Mulai jam masuk' },
                        { selector: 'label', text: 'Selesai jam masuk' },
                        { selector: 'label', text: 'Mulai jam pulang' },
                        { selector: 'label', text: 'Selesai jam pulang' },
                        { selector: 'h5', text: 'Jam Masuk' },
                        { selector: 'h5', text: 'Jam Pulang' },
                        { selector: 'h5', text: 'Terakhir diperbarui' },
                        { selector: 'button', text: 'Save' },
                        { selector: 'button', text: 'Reset' },
                    ];

                    attendancePageElements.forEach(({ selector, text }) => {
                        cy.get(selector).contains(text).should('be.visible');
                    });

                    function getRandomTime(startHour, startMinute, endHour, endMinute) {
                        const start = new Date();
                        start.setHours(startHour, startMinute, 0, 0);

                        const end = new Date();
                        end.setHours(endHour, endMinute, 0, 0);

                        const randomTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
                        return {
                            hour: String(randomTime.getHours()).padStart(2, '0'),
                            minute: String(randomTime.getMinutes()).padStart(2, '0'),
                        };
                    }

                    const entryStart = getRandomTime(5, 0, 5, 5);
                    const entryEnd = getRandomTime(7, 55, 8, 0);
                    const exitStart = getRandomTime(17, 0, 17, 5);
                    const exitEnd = getRandomTime(18, 55, 19, 0);

                    const setTimeInput = (label, time) => {
                        const timeString = `${time.hour}:${time.minute}`;
                        cy.contains('label', label)
                            .parent()
                            .find('input')
                            .clear()
                            .type(timeString, { force: true });
                    };

                    setTimeInput('Mulai jam masuk', entryStart);
                    setTimeInput('Selesai jam masuk', entryEnd);
                    setTimeInput('Mulai jam pulang', exitStart);
                    setTimeInput('Selesai jam pulang', exitEnd);

                    cy.contains('button', 'Save').click();
                    cy.get('.p-dialog').should('be.visible').within(() => {
                        cy.contains('button', 'Ya').click();
                    });
                    cy.get('.p-toast-message-success')
                        .should('be.visible')
                        .and('contain.text', 'Jam default absensi berhasil diperbarui!');
                });
            });
    });
});
