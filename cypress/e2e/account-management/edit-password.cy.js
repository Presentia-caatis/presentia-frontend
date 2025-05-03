describe('Edit Account Password Test', () => {
    const school = Cypress.env('schoolName');
    const roles = ['superadmin', 'admin', 'coadmin', 'staf', 'general_user'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role === 'admin' ? 'admin sekolah'
                : role === 'coadmin' ? 'co-admin sekolah'
                    : role === 'staf' ? 'staf sekolah'
                        : role === 'general_user' ? 'pengguna umum'
                            : role} mengubah password akun`, () => {
                                cy.loginAs(role);
                                cy.contains("Sekolah yang dikelola").should("be.visible");

                                cy.get('.layout-topbar').should('be.visible');
                                cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
                                cy.get('.absolute.bg-white').should('be.visible');
                                cy.contains('Profile Pengguna').click();
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

                                cy.contains('Ganti Password').click();
                                cy.contains('h2', 'Ganti Password').should('be.visible');

                                const buttonsToCheck = [
                                    { label: 'Ganti Password', assert: 'be.visible' },
                                    { label: 'Batal', assert: 'be.visible' }
                                ];

                                buttonsToCheck.forEach(({ label, assert }) => {
                                    cy.contains(label).should(assert);
                                });

                                const passwordFields = [
                                    { label: 'Password Lama', inputId: '#currentPassword' },
                                    { label: 'Password Baru', inputId: '#newPassword' },
                                    { label: 'Konfirmasi Password', inputId: '#confirmPassword' },
                                ];

                                passwordFields.forEach(({ label, inputId }) => {
                                    cy.contains('h5', label).should('be.visible');
                                    cy.get(inputId).should('exist');
                                });

                                //   cy.contains('Ganti Password').click();
                                //   cy.get('.p-confirm-popup')
                                //     .should('be.visible')
                                //     .and('contain.text', 'Apakah Anda yakin ingin mengubah data?')
                                //     .within(() => {
                                //       cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                                //       cy.get('button.p-button-success')
                                //         .should('be.visible')
                                //         .and('contain.text', 'Ya')
                                //         .click();
                                //     });

                                //   cy.get('.p-toast').should('be.visible').then((toast) => {
                                //     if (toast.text().includes('Profil berhasil diperbarui.')) {
                                //       cy.contains('.p-toast-summary', 'Sukses').should('be.visible');
                                //       cy.contains('.p-toast-detail', 'Profil berhasil diperbarui.').should('be.visible');
                                //     } else {
                                //       cy.contains('.p-toast-summary', 'Gagal').should('be.visible');
                                //       cy.contains('.p-toast-detail', 'Terjadi kesalahan saat memperbarui data.').should('be.visible');
                                //     }
                                //   });
                            });
    });
});