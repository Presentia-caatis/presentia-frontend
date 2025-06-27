describe('Student List Page Test', () => {
  const school = Cypress.env('schoolName');
  const roles = ['staf', 'admin'];

  roles.forEach((role) => {
    it(`Cek perilaku ${role === 'staf' ? 'staf sekolah'
      : role === 'admin' ? 'admin sekolah'
        : role} melihat data siswa`, () => {
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
            cy.get('.layout-sidebar').contains('Daftar Siswa').click();
            cy.url().should('include', `/school/${school}/student`);

            cy.get('.card').first().should('exist').and('be.visible');
            cy.get('.card h1')
              .should('contain.text', 'Daftar Siswa')
              .invoke('text')
              .should('match', /^Daftar Siswa\s+\S+/);

            cy.get('table').should('be.visible');
            cy.contains('Memuat data siswa...').should('not.exist');
            cy.get('.card h5')
              .should('contain.text', 'Data Siswa')
              .invoke('text')
              .should('match', /^Data Siswa\s+\S+/);
            cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');

            const expectedHeaders = ["Nama", "NIS", "NISN", "Jenis Kelamin", "Kelas", "Status"];

            cy.get('table thead tr').first().within(() => {
              cy.get('th').each(($th, index, $ths) => {
                if (index === 0) {
                  cy.wrap($th).should('have.class', 'p-selection-column');
                } else if (index === $ths.length - 1) {
                  cy.wrap($th)
                    .invoke('text')
                    .then((text) => {
                      expect(text.trim()).to.be.empty;
                    });
                } else {
                  cy.wrap($th)
                    .invoke('text')
                    .then((text) => {
                      expect(text.trim()).to.equal(expectedHeaders[index - 1]);
                    });
                }
              });
            });

            cy.get('table thead tr').eq(1).within(() => {
              cy.get('th').each(($th, index) => {
                if (index === 0) {
                  cy.wrap($th).find('input.p-checkbox-input').should('exist');
                } else if (index === 7) {
                  cy.wrap($th).should('be.empty');
                } else if ([1, 2, 3].includes(index)) {
                  cy.wrap($th).find('input').should('exist');
                } else if ([4, 5, 6].includes(index)) {
                  cy.wrap($th).find('select').should('exist');
                }
              });
            });

            cy.get('table tbody tr').should('have.length.greaterThan', 0).each(($row) => {
              cy.wrap($row).within(() => {
                cy.get('td').each(($cell, colIndex, $cells) => {
                  const isLast = colIndex === $cells.length - 1;

                  if (colIndex === 0) {
                    cy.wrap($cell).find('input.p-checkbox-input').should('exist');
                  } else if (isLast) {
                  } else {
                    cy.wrap($cell).invoke('text').then((text) => {
                      const trimmed = text.trim();
                      expect(trimmed).not.to.be.empty;

                      if (colIndex === 1) {
                        expect(trimmed).to.match(/\S+/);
                      } else if (colIndex === 2 || colIndex === 3) {
                        expect(trimmed).to.match(/^\d+$/);
                      } else if (colIndex === 4) {
                        expect(trimmed).to.match(/^(Laki-Laki|Perempuan)$/);
                      } else if (colIndex === 5) {
                        expect(trimmed).to.match(/\S+/);
                      } else if (colIndex === 6) {
                        expect(trimmed).to.match(/^(Aktif|Tidak Aktif)$/);
                      }
                    });
                  }
                });
              });
            });
          });
        });
  });
});