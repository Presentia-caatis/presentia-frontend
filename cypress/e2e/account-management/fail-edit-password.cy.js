describe('Failed to Edit Account Password Test', () => {
    const roles = ['admin'];
    //tc-09
    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'general_user' ? 'pengguna umum'
            : role === 'staf' ? 'staf sekolah'
                : role === 'admin' ? 'admin sekolah'
                    : 'superadmin'} tidak dapat mengubah password akun`, function () {

            const oldPassword = 'a';
            const newPassword = 'S1sc02131a';

            cy.loginAs(role);
            cy.get('.layout-topbar').should('be.visible');
            cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
            cy.get('.absolute.bg-white').should('be.visible');
            cy.contains(/Profile Pengguna|Profile/).click();
            cy.url().should('include', '/user/profile');

            const menuItems = [{
                    label: 'Profile Kamu',
                    iconClass: 'pi-user'
                },
                {
                    label: 'Ganti Password',
                    iconClass: 'pi-lock'
                },
                {
                    label: 'Logout',
                    iconClass: 'pi-sign-out'
                },
            ];

            menuItems.forEach(({
                label,
                iconClass
            }) => {
                cy.contains(label).should('be.visible');
                cy.get(`.pi.${iconClass}`).should('exist');
            });

            cy.contains('Ganti Password').click();
            cy.contains('h2', 'Ganti Password').should('be.visible');

            const buttonsToCheck = [{
                    label: 'Ganti Password',
                    assert: 'be.visible'
                },
                {
                    label: 'Batal',
                    assert: 'be.visible'
                }
            ];

            buttonsToCheck.forEach(({
                label,
                assert
            }) => {
                cy.contains(label).should(assert);
            });

            const passwordFields = [{
                    label: 'Password Sekarang',
                    inputId: '#currentPassword'
                },
                {
                    label: 'Password Baru',
                    inputId: '#newPassword'
                },
                {
                    label: 'Konfirmasi Password Baru',
                    inputId: '#confirmPassword'
                },
            ];

            passwordFields.forEach(({
                label,
                inputId
            }) => {
                cy.contains('h5', label).should('be.visible');
                cy.get(inputId).should('exist');
            });

            const changePassword = (oldPassword, newPassword, confirmPass) => {
                cy.get('#currentPassword').type(oldPassword);
                cy.get('#newPassword').type(newPassword);
                cy.get('body').click(0, 0);
                cy.get('#confirmPassword').type(confirmPass);
                cy.get('button').contains('Ganti Password').click();
            };

            changePassword(oldPassword, newPassword, newPassword);

            cy.get('.p-toast').should('be.visible').then((toast) => {
                if (toast.text().includes('Profil berhasil diperbarui.')) {
                    cy.contains('.p-toast-summary', 'Sukses').should('be.visible');
                    cy.contains('.p-toast-detail', 'Profil berhasil diperbarui.').should('be.visible');
                } else {
                    cy.contains('.p-toast-summary', 'Gagal Ganti Password').should('be.visible');
                }
            });
        });
    });
});