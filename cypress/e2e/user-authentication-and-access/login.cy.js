describe('Login Page Test', () => {
    const roles = ['admin'];

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
        const roleName = role === 'admin' ? 'admin sekolah'
            : role;

        it(`Cek perilaku ${roleName} login dengan kredensial yang belum terdaftar`, () => {
            cy.get('input#email').type('presentia_dummy_99');
            cy.get('input[type="password"]').type('Presentia99!');
            cy.get('button[type="submit"]').click();
            cy.url().should('eq', Cypress.config().baseUrl + 'login');
            cy.contains('Login Gagal').should('be.visible');
            cy.contains('Akun tidak ditemukan atau password salah').should('be.visible');
        });

        it(`Cek perilaku ${roleName} login akun dengan kredensial yang valid`, () => {
            cy.loginAs(role);
            cy.get(".p-toast-message", { timeout: 10000 })
                .should("contain", "Login Berhasil")
                .and("contain", "Sekarang kamu sudah masuk ke dalam aplikasi")
                .should("be.visible");
            cy.wait(1000);
        });
    });
});