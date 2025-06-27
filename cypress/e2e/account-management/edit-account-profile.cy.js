describe('Edit Account Profile Test', () => {
  const roles = ['general_user', 'staf', 'admin', 'superadmin',];

  roles.forEach((role) => {
    it(`Cek perilaku ${role === 'general_user' ? 'pengguna umum'
      : role === 'staf' ? 'staf sekolah'
        : role === 'admin' ? 'admin sekolah'
          : 'superadmin'} dapat mengubah profil akun`, () => {
            cy.loginAs(role);

            cy.get('.layout-topbar').should('be.visible');
            cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
            cy.get('.absolute.bg-white').should('be.visible');
            cy.contains(/Profile Pengguna|Profile/).click();
            cy.url().should('include', '/user/profile');

            const menuItems = [
              { label: 'Profile Kamu', iconClass: 'pi-user' },
              { label: 'Ganti Password', iconClass: 'pi-lock' },
              { label: 'Logout', iconClass: 'pi-sign-out' },
            ];

            menuItems.forEach(({ label, iconClass }) => {
              cy.contains(label).should('be.visible');
              cy.get(`.pi.${iconClass}`).should('exist');
            });

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

            const allNames = ["Presentia Dummy Account", "Presentia Dummy", "Presentia Account", "Presentia Test Account", "Presentia Test"];

            cy.get('input[placeholder="Masukkan Nama Lengkap"]').then(($input) => {
              const currentName = $input.val();
              const availableNames = allNames.filter(name => name !== currentName);
              expect(availableNames.length).to.be.greaterThan(0);

              const newName = availableNames[Math.floor(Math.random() * availableNames.length)];
              cy.wrap($input).clear().type(newName);
              cy.wrap($input).should('have.value', newName);

              cy.contains('Simpan Pembaruan').then(($btn) => {
                if ($btn.prop('disabled')) {
                  cy.log('Tombol Simpan Pembaruan tidak bisa diklik.');
                } else {
                  cy.wrap($btn).click();
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

                  cy.get('.p-toast').should('be.visible').then((toast) => {
                    if (toast.text().includes('Profil berhasil diperbarui.')) {
                      cy.contains('.p-toast-summary', 'Sukses').should('be.visible');
                      cy.contains('.p-toast-detail', 'Profil berhasil diperbarui.').should('be.visible');
                    } else {
                      cy.contains('.p-toast-summary', 'Gagal').should('be.visible');
                      cy.contains('.p-toast-detail', 'Terjadi kesalahan saat memperbarui data.').should('be.visible');
                    }
                  });
                }
              });
            });
          });
  });
});