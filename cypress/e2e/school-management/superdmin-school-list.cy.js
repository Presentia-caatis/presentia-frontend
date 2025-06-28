describe('School List Page Test', () => {
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} melihat data sekolah`, () => {
                cy.loginAs(role);
                cy.contains("Selamat datang di dashboard admin").should("be.visible");

                cy.get('.layout-sidebar').should('be.visible');
                cy.get('.layout-sidebar').contains('Daftar Sekolah').click();
                cy.url().should('include', '/admin/school');

                cy.get('.p-datatable').should('exist').and('be.visible');
                cy.contains('Memuat data sekolah...').should('not.exist');

                const expectedHeaders = ['Nama Sekolah', 'Paket', 'Pembayaran Selanjutnya', 'Alamat', 'Aksi'];

                cy.get('.p-datatable-thead > tr').first().within(() => {
                    cy.get('th').should('have.length', expectedHeaders.length + 1).each(($th, index) => {

                        const headerText = $th.text().trim();

                        if (index === 0) {
                            expect(headerText).to.be.empty;
                        } else {
                            expect(headerText).to.equal(expectedHeaders[index - 1]);
                        }
                    });
                });

                cy.get('.p-datatable-tbody > tr').should('have.length.greaterThan', 0).each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').each(($cell, colIndex) => {
                            cy.wrap($cell).then(($el) => {
                                if (colIndex === 0) {
                                    cy.wrap($el).find('img')
                                        .should('exist')
                                        .and('be.visible')
                                        .and(($img) => {
                                            const src = $img.attr('src');
                                            expect(src).to.match(/https?:\/\/.+\.(jpg|jpeg|png|webp)$/);
                                        });
                                } else if ([1, 2, 3].includes(colIndex)) {
                                    const text = $el.text().trim();
                                    expect(text).to.not.be.empty;
                                } else if (colIndex === 4) {
                                    const text = $el.text().trim();
                                    expect(text).to.not.be.empty;
                                } else if (colIndex === 5) {
                                    cy.wrap($el).find('button')
                                        .should('exist')
                                        .and('be.visible')
                                        .and('contain.text', 'Masuk');
                                }
                            });
                        });
                    });
                });
            });
    });
});