describe('Edit Account Password Test', () => {
    const roles = ['general_user', 'staf', 'admin', 'superadmin',];

    const getCredentialForRole = (role, type) => {
        const roleUpper = role.toUpperCase();
        const flatEnvKey = `${roleUpper}_${type.toUpperCase()}`;

        const users = Cypress.env('users');
        if (users && users[role] && users[role][type]) {
            return users[role][type];
        }

        const fromFlat = Cypress.env(flatEnvKey);
        if (fromFlat) {
            return fromFlat;
        }
        throw new Error(`Data ${type} untuk role '${role}' tidak ditemukan di cypress.env.json maupun GitHub Actions`);
    };

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'general_user' ? 'pengguna umum'
            : role === 'staf' ? 'staf sekolah'
                : role === 'admin' ? 'admin sekolah'
                    : 'superadmin'} dapat mengubah password akun`, function () {
                        const oldPassword = getCredentialForRole(role, 'password');
                        const newPassword = 'PasswordBaru123!';

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
                        const changePassword = (oldPassword, newPassword, confirmPass) => {
                            cy.get('#currentPassword').type(oldPassword);
                            cy.get('#newPassword').type(newPassword);
                            cy.get('body').click(0, 0);
                            cy.get('#confirmPassword').type(confirmPass);
                            cy.contains('Ganti Password').click();
                        };

                        changePassword(oldPassword, newPassword, newPassword);

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
                        // changePassword(newPassword, oldPassword, oldPassword);
                    });
    });
});