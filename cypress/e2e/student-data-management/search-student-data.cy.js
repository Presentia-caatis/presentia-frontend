describe('Search Student Data Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['staf', 'admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'staf' ? 'staf sekolah'
            : role === 'admin' ? 'admin sekolah'
                : role} mencari data siswa menggunakan kolom pencarian`, () => {
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
                        cy.get('.layout-sidebar').contains('Daftar Siswa').click();
                        cy.url().should('include', `/school/${school}/student`);

                        cy.get('.card').first().should('exist').and('be.visible');
                        cy.get('.card h1')
                            .should('contain.text', 'Daftar Siswa')
                            .invoke('text')
                            .should('match', /^Daftar Siswa\s+\S+/);

                        cy.get('table').should('be.visible');
                        cy.contains('Memuat data siswa...').should('not.exist');
                        cy.get('.card h5')
                            .should('contain.text', 'Data Siswa')
                            .invoke('text')
                            .should('match', /^Data Siswa\s+\S+/);

                        cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');
                        cy.get('.p-input-icon-left input[placeholder="Search..."]')
                            .clear()
                            .type('Siswa Baru Telkom');
                        cy.contains('Memuat data siswa...').should('exist');
                        cy.wait(2000);
                        cy.get('table tbody tr').each(($row) => {
                            cy.wrap($row).find('td').eq(1).invoke('text').then(text => {
                                const uppercasedText = text.trim().toUpperCase();
                                expect(text.trim()).to.equal(uppercasedText);
                                expect(uppercasedText).to.include('SISWA BARU TELKOM');
                            });
                        });
                    });
                });
    });
});