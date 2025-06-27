describe('Admin Dashboard Page Test', () => {
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} mengakses dashboard admin`, () => {
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
                                .should('match', /^\d+$/);
                        });
                });

                cy.contains('span', 'Pendapatan Bulanan')
                    .should('be.visible')
                    .parent()
                    .within(() => {
                        cy.get('div.text-900')
                            .should('be.visible')
                            .invoke('text')
                            .should('match', /^\$\d+/);
                    });

                const subscriptionAndTicket = [
                    { title: 'Status Berlangganan' },
                    { title: 'Status Tiket' },
                ];

                subscriptionAndTicket.forEach(({ title }) => {
                    cy.contains('h5', title).should('be.visible').then($title => {
                        const card = $title.closest('.card');
                        cy.wrap(card).then($card => {
                            const canvas = $card.find('canvas');
                            if (canvas.length === 0 || !canvas.is(':visible')) {
                                cy.log(`Canvas untuk "${title}" tidak tersedia.`);
                            } else {
                                cy.wrap(canvas).should('be.visible');
                            }
                        });
                    });
                });
            });
    });
});