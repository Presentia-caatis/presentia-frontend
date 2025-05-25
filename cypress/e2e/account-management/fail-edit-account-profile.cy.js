describe('Failed to Edit Account Profile Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['general_user', 'staf', 'admin', 'superadmin',];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'general_user' ? 'pengguna umum'
            : role === 'staf' ? 'staf sekolah'
                : role === 'admin' ? 'admin sekolah'
                    : 'superadmin'} tidak dapat mengubah profil akun`, () => {
                        cy.loginAs(role);
                        cy.contains("Sekolah yang dikelola").should("be.visible");

                        cy.get('.layout-topbar').should('be.visible');
                        cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
                        cy.get('.absolute.bg-white').should('be.visible');
                        cy.contains('Profile Pengguna').click();
                        cy.url().should('include', '/user/profile');

                        cy.get('h1').should('contain.text', 'Profile Pengguna');
                        cy.get('img.w-5rem.h-5rem.border-circle').should('exist');
                        cy.get('input[type="file"]').should('exist');

                        const buttonsToCheck = [
                            { label: 'Ganti Foto', assert: 'be.visible' },
                            { label: 'Hapus Foto', assert: 'be.visible' },
                            { label: 'Simpan Pembaruan', assert: 'be.visible' },
                            { label: 'Batal', assert: 'be.visible' }
                        ];

                        buttonsToCheck.forEach(({ label, assert }) => {
                            cy.contains(label).should(assert);
                        });

                        const inputsToCheck = [
                            { selector: 'input[placeholder="Masukkan Email"]', assert: 'exist', disabled: true },
                            { selector: 'input[placeholder="Masukkan Username"]', assert: 'exist', disabled: false },
                            { selector: 'input[placeholder="Masukkan Nama Lengkap"]', assert: 'exist', disabled: false }
                        ];

                        inputsToCheck.forEach(({ selector, assert, disabled }) => {
                            cy.get(selector).should(assert);
                            if (disabled !== undefined) {
                                cy.get(selector).should(disabled ? 'be.disabled' : 'not.be.disabled');
                            }
                        });

                        cy.get('input[placeholder="Masukkan Nama Lengkap"]')
                            .invoke('val')
                            .then((currentName) => {
                                const allNames = ["Presentia Dummy Account 1", "Presentia Dummy 1", "Presentia Account 1", "Presentia Test Account 1", "Presentia Test 1"];

                                let newName = allNames.find(name => name !== currentName);
                                if (!newName) {
                                    const timestamp = Date.now();
                                    newName = `${currentName} ${timestamp}`;
                                }

                                cy.get('input[placeholder="Masukkan Nama Lengkap"]')
                                    .clear()
                                    .type(newName)
                                    .should('have.value', newName);

                                cy.contains('Simpan Pembaruan')
                                    .click();
                                cy.get('.p-confirm-popup')
                                    .should('be.visible')
                                    .and('contain.text', 'Apakah Anda yakin ingin mengubah data?')
                                    .within(() => {
                                        cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                                        cy.get('button.p-button-success')
                                            .should('be.visible')
                                            .and('contain.text', 'Ya')
                                            .click();
                                    });
                            });

                        cy.get('.p-toast').should('be.visible').then((toast) => {
                            if (toast.text().includes('Profil berhasil diperbarui.')) {
                                cy.contains('.p-toast-summary', 'Sukses').should('be.visible');
                                cy.contains('.p-toast-detail', 'Profil berhasil diperbarui.').should('be.visible');
                            } else {
                                cy.contains('.p-toast-summary', 'Gagal').should('be.visible');
                                cy.contains('.p-toast-detail', 'Terjadi kesalahan saat memperbarui data.').should('be.visible');
                            }
                        });
                    });
    });
});