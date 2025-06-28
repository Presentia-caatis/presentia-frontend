describe('Select Date for Attendance Data Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} memilih rentang tanggal daftar presensi`, () => {
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
                    cy.get('.layout-sidebar').contains('Kehadiran Siswa').click();
                    cy.url().should('include', `/school/${school}/attendance`);

                    cy.get('.card').first().should('exist').and('be.visible');
                    cy.get('.card h1')
                        .should('contain.text', 'Kehadiran')
                        .invoke('text')
                        .should('match', /^Kehadiran\s+\S+/);

                    // const filters = [
                    //     {
                    //         label: 'Pilih Tanggal Kehadiran',
                    //         elements: [
                    //             { selector: '#startDate input[placeholder="Tanggal Awal"]', shouldExist: true },
                    //             { selector: '#endDate input[placeholder="Tanggal Akhir"]', shouldExist: true }
                    //         ]
                    //     },
                    //     { label: 'Pilih Kelas', selector: '.p-multiselect' },
                    //     { label: 'Pilih Status Presensi', selector: '.p-multiselect' }
                    // ];

                    // filters.forEach((filter) => {
                    //     cy.contains('h5', filter.label).should('be.visible')
                    //         .parent().within(() => {
                    //             if (filter.elements) {
                    //                 filter.elements.forEach((el) => {
                    //                     cy.get(el.selector).should(el.shouldExist ? 'exist' : 'not.exist');
                    //                 });
                    //             } else {
                    //                 cy.get(filter.selector).should('exist');
                    //             }
                    //         });
                    // });

                    cy.contains('h3', 'Tampilkan data kehadiran siswa')
                        .should('be.visible')
                        .then(() => {
                            cy.contains('button', 'Tampilkan')
                                .should('be.visible')
                                .and('not.be.disabled')
                        });

                    const buttons = [
                        { label: 'Export', icon: '.pi.pi-upload', shouldBeDisabled: false }
                    ];

                    buttons.forEach(({ label, icon, shouldBeDisabled }) => {
                        cy.contains('button', label)
                            .should('be.visible')
                            .within(() => {
                                cy.get(icon).should('be.visible');
                            });

                        if (shouldBeDisabled !== undefined) {
                            cy.contains('button', label).should(shouldBeDisabled ? 'be.disabled' : 'not.be.disabled');
                        }
                    });

                    cy.get('.card').eq(1).should('exist').and('be.visible');
                    cy.get('table').should('be.visible');
                    cy.contains('Memuat data kehadiran...').should('not.exist');

                    cy.get('h5')
                        .contains(/^Data kehadiran siswa/)
                        .should('be.visible')
                        .invoke('text')
                        .should('match', /^Data kehadiran siswa\s+\S+/);
                    cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');

                    const today = new Date();
                    const day = String(today.getDate()).padStart(2, '0');
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const year = today.getFullYear();
                    const todayFormatted = `${day}/${month}/${year}`;

                    cy.get('#startDate input[placeholder="Tanggal Awal"]').click();
                    cy.get('.p-datepicker-calendar td')
                        .not('.p-disabled')
                        .contains(new RegExp(`^${parseInt(day)}$`))
                        .click();
                    cy.get('#startDate input[placeholder="Tanggal Awal"]')
                        .should('have.value', todayFormatted);

                    cy.get('#endDate input[placeholder="Tanggal Akhir"]').click();
                    cy.get('.p-datepicker-calendar td')
                        .not('.p-disabled')
                        .contains(new RegExp(`^${parseInt(day)}$`))
                        .click();
                    cy.get('#endDate input[placeholder="Tanggal Akhir"]')
                        .should('have.value', todayFormatted);

                    cy.contains('button', 'Tampilkan').click();
                    cy.contains('Memuat data kehadiran...').should('not.exist');
                    cy.wait(1000);
                    cy.get("table tbody tr").then(($rows) => {
                        if ($rows.length === 1) {
                            cy.wrap($rows)
                                .first()
                                .within(() => {
                                    cy.get("td")
                                        .invoke("text")
                                        .should("include", "Belum ada data kehadiran");
                                });
                        } else {
                            cy.get("table tbody tr").each(($row) => {
                                cy.wrap($row)
                                    .find("td")
                                    .eq(5)
                                    .invoke("text")
                                    .then((textValue) => {
                                        expect(textValue).to.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
                                    });
                            });
                        }
                    });
                });
            });
    });
});