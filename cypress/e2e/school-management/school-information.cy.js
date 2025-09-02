describe('School Information Test', () => {
    const roles = ['admin'];
    //tc-04
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'staf' ? 'staf sekolah'
            : role === 'admin' ? 'admin sekolah'
                : role} melihat informasi sekolah`, () => {
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

                    schoolData.forEach(({ selector, assertion, icon, text: label }) => {
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
                });
    });
});