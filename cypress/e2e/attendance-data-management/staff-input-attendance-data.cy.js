describe('Staff input attendance data test', () => {
    const roles = ['staf'];
    //tc-45
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'staf' ? 'staf sekolah'
            : role
            }
            dapat melakukan pendataan presensi melalui input teks berupa Nomor Induk Siswa(NIS)
            `, () => {
            cy.loginAs(role);
            // cy.contains("Selamat datang di dashboard admin").should("be.visible");

            // const schoolAndUser = [
            //     'Jumlah Sekolah',
            //     'Jumlah Sekolah yang Berlangganan',
            //     'Jumlah Pengguna'
            // ];
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
                    .should('be.visible')
                    .within(() => {
                        cy.get(icon).should('be.visible');
                        cy.contains(text).should('be.visible');
                    })
                    .click();

                cy.get('h1')
                    .should('be.visible')
                    .invoke('text')
                    .should('match', /Selamat Datang di Dashboard .+/);
            });
            cy.get('.layout-sidebar').should('be.visible');
            cy.get('.layout-sidebar').contains('Presensi Manual').click();

            // schoolAndUser.forEach((label) => {
            //     cy.contains('span', label)
            //         .should('be.visible')
            //         .parent()
            //         .within(() => {
            //             cy.get('div.text-900')
            //                 .should('be.visible')
            //                 .invoke('text')
            //                 .should('match', /^\d+$/);
            //         });
            // });

            // cy.contains('span', 'Pendapatan Bulanan')
            //     .should('be.visible')
            //     .parent()
            //     .within(() => {
            //         cy.get('div.text-900')
            //             .should('be.visible')
            //             .invoke('text')
            //             .should('match', /^\$\d+/);
            //     });

            // const subscriptionAndTicket = [{
            //         title: 'Status Berlangganan'
            //     },
            //     {
            //         title: 'Status Tiket'
            //     },
            // ];

            // subscriptionAndTicket.forEach(({
            //     title
            // }) => {
            //     cy.contains('h5', title).should('be.visible').then($title => {
            //         const card = $title.closest('.card');
            //         cy.wrap(card).then($card => {
            //             const canvas = $card.find('canvas');
            //             if (canvas.length === 0 || !canvas.is(':visible')) {
            //                 cy.log(`Canvas untuk "${title}" tidak tersedia.`);
            //             } else {
            //                 cy.wrap(canvas).should('be.visible');
            //             }
            //         });
            //     });
            // });
        });
    });
});