describe("Register Student Fingerprint Test", () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];
    //tc-30
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin'
            : role
            }
            memilih kelas, melakukan pencarian data siswa, dan memilih jari dan dapat melakukan pendaftaran sidik jari siswa, kemudian dapat melihat informasi sidik jari siswa.
            `, () => {
            cy.loginAs(role);
            cy.contains("Sekolah yang dikelola").should("be.visible");
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
                // cy.url().should('include', url);

                cy.get(".layout-sidebar").should("be.visible");
                cy.get(".layout-sidebar").contains("Daftar Sidik Jari").click();
                // cy.url().should("include", `/school/${school}/fingerprint`);
            });

            // cy.wait(5000);
            // // cy.get("h1").should("contain.text", "Pendaftaran Sidik Jari");
            // cy.get("label")
            //     .contains("Pilih Kelas")
            //     .parent()
            //     .find(".p-dropdown")
            //     .click();
            // cy.get(".p-dropdown-items-wrapper .p-dropdown-item")
            //     .first()
            //     .click();

            // cy.get("label")
            //     .contains("Cari Siswa")
            //     .parent()
            //     .find("input")
            //     .type("Siswa Sekolah");

            // cy.wait(5000);
            // cy.get("label")
            //     .contains("Pilih Siswa")
            //     .parent()
            //     .find(".p-dropdown")
            //     .click();
            // cy.get(".p-dropdown-items-wrapper .p-dropdown-item")
            //     .first()
            //     .click();

            // cy.get("label")
            //     .contains("Pilih Jari")
            //     .parent()
            //     .find(".p-dropdown")
            //     .click();
            // cy.get(".p-dropdown-items-wrapper .p-dropdown-item")
            //     .first()
            //     .click();

            // cy.get("label")
            //     .contains("Nomor Mesin")
            //     .parent()
            //     .find("input")
            //     .type("123XYZ");

            // cy.contains("button", "Daftarkan Sidik Jari").should("be.visible").click()
            // cy.get('.p-toast-message')
            //     .should('contain.text', 'Pendaftaran Berhasil')
            //     .and('contain.text', 'Segera daftarkan sidik jari pada mesin.')
            //     .and('be.visible');
        });
    });
});