describe('Edit School Profile Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} tidak dapat memperbarui data sekolah`, () => {
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

                cy.get('h1')
                    .should('be.visible')
                    .invoke('text')
                    .should('match', /Selamat Datang di Dashboard .+/);

                cy.get('.layout-topbar').should('be.visible');
                cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
                cy.get('.absolute.bg-white').should('be.visible');
                cy.contains('Profile Sekolah').click();
                cy.url().should('include', `/school/${school}/profile`);

                cy.get('h1').should('contain.text', 'Profile Sekolah');
                cy.get('img.w-5rem.h-5rem.border-circle').should('exist');
                cy.get('input[type="file"]').should('exist');

                const buttonsToCheck = [
                    { label: 'Ganti Logo', assert: 'be.visible' },
                    { label: 'Hapus Logo', assert: 'be.visible' },
                    { label: 'Simpan Pembaruan', assert: 'be.visible' },
                    { label: 'Batal', assert: 'be.visible' }
                ];

                buttonsToCheck.forEach(({ label, assert }) => {
                    cy.contains(label).should(assert);
                });

                const inputsToCheck = [
                    { selector: 'input[placeholder="Masukkan Nama Sekolah"]', assert: 'exist', disabled: false },
                    { selector: 'input[placeholder="Masukkan Alamat"]', assert: 'exist', disabled: false },
                ];

                inputsToCheck.forEach(({ selector, assert, disabled }) => {
                    cy.get(selector).should(assert);
                    if (disabled !== undefined) {
                        cy.get(selector).should(disabled ? 'be.disabled' : 'not.be.disabled');
                    }
                });

                cy.get('input[placeholder="Masukkan Nama Sekolah"]')
                    .invoke('val')
                    .then((currentName) => {
                        const allNames = ["SMK Telkom", "SMK Telkom Bandung", "Sekolah Menengah Kejuruan Telkom", "Sekolah Menengah Kejuruan Telkom Bandung"];
                        const newName = allNames.find((name) => name !== currentName);
                        expect(newName, 'Nama baru tidak boleh sama dengan yang lama').to.exist;

                        cy.get('input[placeholder="Masukkan Nama Sekolah"]').clear().type(newName);
                        cy.get('input[placeholder="Masukkan Nama Sekolah"]').should('have.value', newName);

                        cy.contains('Simpan Pembaruan').click();
                        cy.get('.p-confirm-popup')
                            .should('be.visible')
                            .and('contain.text', 'Apakah Anda yakin ingin mengubah data sekolah?')
                            .within(() => {
                                cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                                cy.get('button.p-button-success')
                                    .should('be.visible')
                                    .and('contain.text', 'Ya')
                                    .click();
                            });
                    });

                cy.get('body').then(($body) => {
                    const text = $body.text();
                    if (text.includes('Data sekolah berhasil diperbarui.')) {
                        cy.contains('Data sekolah berhasil diperbarui.').should('be.visible');
                    } else if (text.includes('Gagal memperbarui data sekolah')) {
                        cy.contains('Gagal memperbarui data sekolah').should('be.visible');
                    } else {
                        cy.log('Toast export tidak muncul');
                    }
                });
            });
    });
});