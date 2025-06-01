describe("Select Name for Student Fingerprint Registration Test", () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} mencari data siswa yang akan didaftarkan sidik jarinya`, () => {
                cy.loginAs(role);
                cy.contains("Selamat datang di dashboard admin").should("be.visible");

                cy.get('.layout-sidebar').should('be.visible');
                cy.get('.layout-sidebar').contains('Daftar Sekolah').click();
                cy.url().should('include', '/admin/school');

                cy.get('table').should('be.visible');
                cy.contains('td', schoolName).should('be.visible');
                cy.contains('td', schoolName)
                    .parents('tr')
                    .within(() => {
                        cy.contains('button', 'Masuk').click();
                    });
                cy.url().should('include', `/school/${school}/dashboard`);

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
            });
    });
});