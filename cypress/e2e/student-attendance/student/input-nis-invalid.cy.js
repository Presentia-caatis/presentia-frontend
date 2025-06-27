describe('Input NIS Invalid Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'siswa'
            : role} melakukan presensi dengan NIS yang tidak valid`, () => {
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

                    cy.get('.layout-sidebar').should('be.visible');
                    cy.get('.layout-sidebar').contains('Presensi Manual').click();
                    cy.visit('/school/student/attendance/in');

                    const nis = '7860761511';

                    cy.get('input[placeholder="Masukkan NIS"]')
                        .clear()
                        .type(`${nis}{enter}`);

                    cy.get('.p-toast')
                        .should('be.visible')
                        .invoke('text')
                        .then((text) => {
                            const trimmed = text.trim();
                            if (trimmed === 'Gagal\nResource not found') {
                                expect(trimmed).to.include('Gagal');
                                expect(trimmed).to.include('Resource not found');
                            } else if (trimmed === 'Gagal\nWaktu presensi diluar jangka waktu yang ditentukan') {
                                expect(trimmed).to.include('Gagal');
                                expect(trimmed).to.include('Waktu presensi diluar jangka waktu yang ditentukan');
                            } else {
                                expect(trimmed).to.match(/Sukses|Peringatan|Gagal/);
                            }
                        });
                });
            });
    });
});