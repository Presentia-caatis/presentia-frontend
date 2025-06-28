describe('Student Fingerprint List Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} melihat daftar sidik jari siswa`, () => {
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
                    cy.get('.layout-sidebar').contains('Daftar Sidik Jari').click();
                    cy.url().should('include', `/school/${school}/fingerprint`);

                    // cy.get('.card h1').should('contain.text', 'Login untuk mendaftaran Sidik Jari');

                    // const username = Cypress.env('ADMS_USERNAME');
                    // const password = Cypress.env('ADMS_PASSWORD');

                    // if (username && password) {
                    //     cy.get('label').contains('Username').parent().find('input').type(username);
                    //     cy.get('label').contains('Password').parent().find('input').type(password);
                    // } else {
                    //     cy.readFile('cypress.env.json').then((data) => {
                    //         const localUsername = data.users.adms.username;
                    //         const localPassword = data.users.adms.password;
                    //         cy.get('label').contains('Username').parent().find('input').type(localUsername);
                    //         cy.get('label').contains('Password').parent().find('input').type(localPassword);
                    //     });
                    // }

                    // cy.contains('button', 'Login')
                    //     .should('be.visible')
                    //     .and('not.be.disabled')
                    //     .click();
                    // cy.url().should('include', `/school/${school}/fingerprint`);

                    cy.get('h5')
                        .contains(/^Daftar Sidik Jari Siswa$/)
                        .should('be.visible');

                    cy.get('table').should('be.visible');
                    cy.contains('Memuat data siswa...').should('not.exist');

                    const expectedHeaders = ["Nama Siswa", "Kelas", "Status Sidik Jari", "Aksi"];

                    cy.get('table thead tr').first().within(() => {
                        cy.get('th').each(($th, index, $ths) => {
                            cy.wrap($th)
                                .invoke('text')
                                .then((text) => {
                                    const trimmedText = text.trim();

                                    if (index === 0) {
                                        cy.wrap($th).should('have.class', 'p-sortable-column');
                                        expect(trimmedText).to.equal(expectedHeaders[0]);
                                    } else if (index === $ths.length - 1) {
                                        expect(trimmedText).to.be.oneOf(["", expectedHeaders[index]]);
                                    } else {
                                        expect(trimmedText).to.equal(expectedHeaders[index]);
                                    }
                                });
                        });
                    });

                    cy.get('table thead tr').eq(1).within(() => {
                        cy.get('th').each(($th, index) => {
                            if (index === 0) {
                                cy.get('input[placeholder="Cari Nama Siswa"]').should('exist').and('be.visible');
                            } else if (index === 1 || index === 2) {
                                cy.wrap($th).find('.p-dropdown').should('exist');
                            } else {
                                cy.wrap($th).children().should('have.length', 0);
                            }
                        });
                    });

                    cy.get('table tbody tr').then(($rows) => {
                        if ($rows.length === 1 && $rows.text().includes("Belum ada data siswa")) {
                            cy.wrap($rows).should('contain.text', 'Belum ada data siswa');
                        } else {
                            expect($rows.length).to.be.greaterThan(0);

                            cy.wrap($rows).each(($row, rowIndex) => {
                                cy.wrap($row).within(() => {
                                    cy.get('td').each(($td, index) => {
                                        cy.wrap($td).invoke('text').then((text) => {
                                            const trimmedText = text.trim();

                                            if (index === 0 || index === 1) {
                                                expect(trimmedText).not.to.be.empty;
                                            } else if (index === 2) {
                                                expect(trimmedText).to.match(/Terdaftar|Belum terdaftar/);
                                            } else if (index === 3) {
                                                cy.wrap($td).contains('Lihat Sidik Jari').should('exist')
                                            }
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            });
    });
});