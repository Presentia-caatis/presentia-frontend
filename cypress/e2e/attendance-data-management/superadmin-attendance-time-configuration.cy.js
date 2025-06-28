describe("Attendance Time Configuration Test", () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} mengonfigurasi waktu presensi siswa`, () => {
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
                cy.get('.p-toast').should('be.visible');
                cy.get('.p-toast-summary').should('contain.text', 'Sukses').should('be.visible')
                cy.get('.p-toast-detail').should('contain.text', 'Jam default absensi berhasil diperbarui!').should('be.visible')
            });
    });
});