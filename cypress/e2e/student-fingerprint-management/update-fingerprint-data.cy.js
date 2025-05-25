describe("Update Student Fingerprint Test", () => {
    const school = Cypress.env('schoolName');
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} dapat memperbarui data sidik jari siswa`, () => {
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

                    cy.get(".card h1").should("contain.text", "Login untuk mendaftaran Sidik Jari");

                    const username = Cypress.env('ADMS_USERNAME');
                    const password = Cypress.env('ADMS_PASSWORD');

                    if (username && password) {
                        cy.get('label').contains('Username').parent().find('input').type(username);
                        cy.get('label').contains('Password').parent().find('input').type(password);
                    } else {
                        cy.readFile('cypress.env.json').then((data) => {
                            const localUsername = data.users.adms.username;
                            const localPassword = data.users.adms.password;
                            cy.get('label').contains('Username').parent().find('input').type(localUsername);
                            cy.get('label').contains('Password').parent().find('input').type(localPassword);
                        });
                    }

                    cy.contains('button', 'Login')
                        .should('be.visible')
                        .and('not.be.disabled')
                        .click();
                    cy.url().should('include', `/school/${school}/fingerprint`);
                });

                cy.wait(5000);
                cy.get("h1").should("contain.text", "Pendaftaran Sidik Jari");
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
                cy.get(".p-dropdown-items-wrapper .p-dropdown-item")
                    .first()
                    .click();

                cy.get("label")
                    .contains("Pilih Jari")
                    .parent()
                    .find(".p-dropdown")
                    .click();
                cy.get(".p-dropdown-items-wrapper .p-dropdown-item")
                    .first()
                    .click();

                cy.get("label")
                    .contains("Nomor Mesin")
                    .parent()
                    .find("input")
                    .type("123XYZ");

                cy.contains("button", "Daftarkan Sidik Jari").should("be.visible").click()
                cy.get('.p-toast-message')
                    .should('contain.text', 'Pendaftaran Berhasil')
                    .and('contain.text', 'Segera daftarkan sidik jari pada mesin.')
                    .and('be.visible');
            });
    });
});