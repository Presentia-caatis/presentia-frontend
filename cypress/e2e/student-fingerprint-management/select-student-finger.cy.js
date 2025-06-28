describe("Select Finger for Student Fingerprint Registration Test", () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} memilih jari dari siswa yang akan didaftarkan sidik jarinya`, () => {
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

                    cy.get(".layout-sidebar").should("be.visible");
                    cy.get(".layout-sidebar").contains("Daftar Sidik Jari").click();
                    cy.url().should("include", `/school/${school}/fingerprint`);

                    //     cy.get(".card h1").should("contain.text", "Login untuk mendaftaran Sidik Jari");

                    //     const username = Cypress.env('ADMS_USERNAME');
                    //     const password = Cypress.env('ADMS_PASSWORD');

                    //     if (username && password) {
                    //         cy.get('label').contains('Username').parent().find('input').type(username);
                    //         cy.get('label').contains('Password').parent().find('input').type(password);
                    //     } else {
                    //         cy.readFile('cypress.env.json').then((data) => {
                    //             const localUsername = data.users.adms.username;
                    //             const localPassword = data.users.adms.password;
                    //             cy.get('label').contains('Username').parent().find('input').type(localUsername);
                    //             cy.get('label').contains('Password').parent().find('input').type(localPassword);
                    //         });
                    //     }

                    //     cy.contains('button', 'Login')
                    //         .should('be.visible')
                    //         .and('not.be.disabled')
                    //         .click();
                    //     cy.url().should('include', `/school/${school}/fingerprint`);
                    // });

                    cy.wait(5000);
                    // cy.get("h1").should("contain.text", "Pendaftaran Sidik Jari");
                    cy.get("label")
                        .contains("Pilih Kelas")
                        .parent()
                        .find(".p-dropdown")
                        .click();
                    cy.get(".p-dropdown-items-wrapper .p-dropdown-item")
                        .first()
                        .click();

                    cy.get("label")
                        .contains("Cari Siswa")
                        .parent()
                        .find("input")
                        .type("Siswa Sekolah");

                    cy.wait(5000);
                    cy.get("label")
                        .contains("Pilih Siswa")
                        .parent()
                        .find(".p-dropdown")
                        .click();
                    cy.get("div.p-dropdown-items-wrapper").then($wrapper => {
                        const items = $wrapper.find(".p-dropdown-item");

                        if (items.length > 0) {
                            cy.wrap(items).first().click();
                        } else {
                            cy.get("div.p-dropdown-items-wrapper").should("contain", "Tidak ada siswa dengan nama");
                        }
                    });

                    cy.get("label")
                        .contains("Pilih Jari")
                        .parent()
                        .find(".p-dropdown")
                        .click();
                    cy.get(".p-dropdown-items-wrapper .p-dropdown-item")
                        .first()
                        .click();
                });
            });
    });
});