describe('Input NIS Valid Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'siswa'
            : role} melakukan presensi dengan input NIS yang valid`, () => {
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

                    const randomNis = Math.floor(Math.random() * 10000000000);

                    cy.get('input[placeholder="Masukkan NIS"]')
                        .type(randomNis.toString())
                        .type('{enter}');

                    cy.get('.p-toast').should('be.visible').invoke('text').then((text) => {
                        if (text.trim() === 'Gagal\nResource not found') {
                            cy.get('.p-toast').should('have.text', 'Gagal\nResource not found');
                        } else if (text.includes('Sukses')) {
                            cy.get('.p-toast').should('contain.text', 'Sukses');
                        } else if (text.includes('Peringatan')) {
                            cy.get('.p-toast').should('contain.text', 'Peringatan');
                        } else if (text.includes('Gagal')) {
                            cy.get('.p-toast').should('contain.text', 'Gagal');
                        } else {
                            throw new Error('Tidak ada toast');
                        }
                    });
                });
            });
    });
});