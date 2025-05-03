describe('Edit Account Profil Test', () => {
  const school = Cypress.env('schoolName');
  const roles = ['superadmin', 'admin', 'coadmin', 'staf', 'general_user'];

  roles.forEach((role) => {
    it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
      : role === 'admin' ? 'admin sekolah'
        : role === 'coadmin' ? 'co-admin sekolah'
          : role === 'staf' ? 'staf sekolah'
            : role === 'general_user' ? 'pengguna umum'
              : role} mengubah profil akun`, () => {
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
                    const allNames = ["Presentia Dummy Account", "Presentia Dummy", "Presentia Account", "Presentia New Account", "Presentia Test User"];
                    const newName = allNames.find((name) => name !== currentName);

                    expect(newName, 'Nama baru tidak boleh sama dengan yang lama').to.exist;

                    cy.get('input[placeholder="Masukkan Nama Lengkap"]').clear().type(newName);
                    cy.get('input[placeholder="Masukkan Nama Lengkap"]').should('have.value', newName);

                    cy.contains('Simpan Pembaruan').click();
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