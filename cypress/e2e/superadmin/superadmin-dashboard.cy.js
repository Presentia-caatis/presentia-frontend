describe('Superadmin Dashboard Page Test', () => {
    const roles = ['superadmin'];
    //tc-40
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role
            }
            dapat melihat overview data sekolah dan pengguna pada dashboard admin `, () => {
            cy.loginAs(role);
            cy.contains("Selamat datang di dashboard admin").should("be.visible");

            const schoolAndUser = [
                'Jumlah Sekolah',
                'Jumlah Sekolah yang Berlangganan',
                'Jumlah Pengguna'
            ];

            schoolAndUser.forEach((label) => {
                cy.contains('span', label)
                    .should('be.visible')
                    .parent()
                    .within(() => {
                        cy.get('div.text-900')
                            .should('be.visible')
                            .invoke('text')
                    });
            });

            cy.contains('span', 'Pendapatan Bulanan')
                .should('be.visible')
                .parent()
                .within(() => {
                    cy.get('div.text-900')
                        .should('be.visible')
                        .invoke('text')
                });
        });
    });
});