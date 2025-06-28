describe('Edit Account Password Test', () => {
    const roles = ['admin'];

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
        it(`Cek perilaku ${role === 'admin' ? 'admin sekolah'
            : role} dapat mengubah password akun`, function () {

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
                    { label: 'Password Sekarang', inputId: '#currentPassword' },
                    { label: 'Password Baru', inputId: '#newPassword' },
                    { label: 'Konfirmasi Password', inputId: '#confirmPassword' },
                ];

                passwordFields.forEach(({ label, inputId }) => {
                    cy.contains('h5', label).should('be.visible');
                    cy.get(inputId).should('exist');
                });

                cy.get('#currentPassword').clear().type(oldPassword);
                cy.get('#newPassword').clear().type(newPassword);
                cy.get('#confirmPassword').clear().type(newPassword);
                cy.get('.p-button').contains('Ganti Password').click()

                cy.contains('.p-toast-summary', /Sukses|Gagal/, { timeout: 10000 }).should('exist');
                cy.contains('.p-toast-detail', /Password berhasil diganti|Terjadi kesalahan/, { timeout: 10000 }).should('exist');

                cy.url().should('include', '/user/dashboard');
                cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
                cy.get('.absolute.bg-white').should('be.visible');
                cy.contains(/Profile Pengguna|Profile/).click();
                cy.url().should('include', '/user/profile');

                cy.contains('Ganti Password').click();

                cy.get('#currentPassword').clear().type(newPassword);
                cy.get('#newPassword').clear().type(oldPassword);
                cy.get('#confirmPassword').clear().type(oldPassword);
                cy.get('.p-button').contains('Ganti Password').click();
            });
    });
});