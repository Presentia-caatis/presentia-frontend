describe("Fail Attendance Time Configuration Test", () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];
    //tc-37
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} gagal mengonfigurasi waktu presensi siswa`, () => {
            cy.loginAs(role);
            cy.contains("Sekolah yang dikelola").should("be.visible");

            const buttons = [{
                selector: 'button.p-button-primary',
                icon: '.pi.pi-home',
                text: 'Dashboard Sekolah',
                // url: `/school/${school}/dashboard`
            }, ];

            buttons.forEach(({
                selector,
                icon,
                text,
                url
            }) => {
                cy.get(selector)
                    .should("be.visible")
                    .within(() => {
                        cy.get(icon).should("be.visible");
                        cy.contains(text).should("be.visible");
                    })
                    .click();
                // cy.url().should("include", url);

                cy.get(".layout-sidebar").should("be.visible");
                cy.get(".layout-sidebar").contains("Konfigurasi Waktu Presensi").click();
                // cy.url().should("include", `/school/${school}/default-attendance-time`);

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
                // Jam Masuk (VALID)
                const entryStart = {
                    hour: '06',
                    minute: '30'
                }; // valid < selesai
                const entryEnd = {
                    hour: '07',
                    minute: '45'
                }; // valid > start dan < jam pulang

                // Jam Pulang
                const exitStart = {
                    hour: '07',
                    minute: '30'
                }; // INVALID karena < selesai jam masuk (07:45)
                const exitEnd = {
                    hour: '18',
                    minute: '15'
                }; // VALID karena > jam mulai pulang


                const setTimeInput = (label, time) => {
                    const timeString = `${time.hour}:${time.minute}`;
                    cy.contains('label', label)
                        .parent()
                        .find('input')
                        .clear()
                        .type(timeString, {
                            force: true
                        });
                };

                setTimeInput('Mulai jam masuk', entryStart);
                setTimeInput('Selesai jam masuk', entryEnd);
                setTimeInput('Mulai jam pulang', exitStart);
                setTimeInput('Selesai jam pulang', exitEnd);

                cy.contains('button', 'Save').click();
                cy.get('.p-dialog').should('be.visible').within(() => {
                    cy.contains('button', 'Ya').click();
                });

            });
        });
    });
});