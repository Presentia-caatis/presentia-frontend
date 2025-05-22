describe('Login Page Test', () => {
    const roles = ['general_user', 'staf', 'admin', 'superadmin'];

    beforeEach(() => {
        cy.visit('/');
        cy.contains('Login').click();
        cy.url().should('include', '/login');

        const loginElements = [
            { selector: 'h2', text: 'Selamat Datang!' },
            { selector: 'p', text: 'Silahkan Log In Untuk Melanjutkan Ke Dashboard' },
            { selector: 'label', text: 'Email' },
            { selector: '#email', visible: true },
            { selector: 'label', text: 'Password' },
            { selector: '#password', visible: true },
            { selector: 'label', text: 'Simpan Password?' },
            { selector: 'button', text: 'Log In', visible: true },
            { selector: 'button', text: 'Sign up with Google', visible: true }
        ];

        loginElements.forEach(({ selector, text, visible }) => {
            if (text) cy.get(selector).contains(text);
            if (visible) cy.get(selector).should('be.visible');
        });
    });

    roles.forEach((role) => {
        const roleName = role === 'general_user' ? 'pengguna umum'
            : role === 'staf' ? 'staf sekolah'
                : role === 'admin' ? 'admin sekolah'
                    : 'superadmin';

        // it(`Cek perilaku ${roleName} login tanpa input kredensial`, () => {
        //     cy.get('button[type="submit"]').click();
        //     cy.url().should('eq', Cypress.config().baseUrl + 'login');
        //     cy.get('#email').parent().find('.p-error')
        //         .should('contain', 'Email atau username harus diisi')
        //         .and('be.visible');
        //     cy.get('#password').parent().find('.p-error')
        //         .should('contain', 'Password is required')
        //         .and('be.visible');
        // });

        it(`Cek perilaku ${roleName} login dengan kredensial yang belum terdaftar`, () => {
            cy.get('input#email').type('presentia99');
            cy.get('input[type="password"]').type('Presenti99!');
            cy.get('button[type="submit"]').click();
            cy.url().should('eq', Cypress.config().baseUrl + 'login');
            cy.contains('Login Gagal').should('be.visible');
            cy.contains('Akun tidak ditemukan atau password salah').should('be.visible');
        });

        it(`Cek perilaku ${roleName} login akun dengan kredensial yang valid`, () => {
            cy.loginAs(role);
            cy.url().should("include", "/user/dashboard");
            cy.get(".p-toast-message")
                .should("contain", "Login Berhasil")
                .and("contain", "Sekarang kamu sudah masuk ke dalam aplikasi")
                .should("be.visible");
            cy.contains("Sekolah yang dikelola").should("be.visible");
        });
    });
});