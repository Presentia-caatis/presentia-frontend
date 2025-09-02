describe('Login Page Test', () => {
    const roles = ['admin'];
    //tc-03
    beforeEach(() => {
        cy.visit('/');
        cy.contains('Login').click();
        cy.url().should('include', '/login');

        const loginElements = [{
                selector: 'h2',
                text: 'Selamat Datang!'
            },
            {
                selector: 'p',
                text: 'Silahkan Log In Untuk Melanjutkan Ke Dashboard'
            },
            {
                selector: 'label',
                text: 'Email'
            },
            {
                selector: '#email',
                visible: true
            },
            {
                selector: 'label',
                text: 'Password'
            },
            {
                selector: '#password',
                visible: true
            },
            {
                selector: 'label',
                text: 'Simpan Password?'
            },
            {
                selector: 'button',
                text: 'Log In',
                visible: true
            },
        ];

        loginElements.forEach(({
            selector,
            text,
            visible
        }) => {
            if (text) cy.get(selector).contains(text);
            if (visible) cy.get(selector).should('be.visible');
        });
    });

    roles.forEach((role) => {
        const roleName = role === 'general_user' ? 'pengguna umum' :
            role === 'staf' ? 'staf sekolah' :
            role === 'admin' ? 'admin sekolah' :
            'superadmin';



        it(`Cek perilaku ${roleName} login dengan kredensial yang belum terdaftar`, () => {
            cy.get('input#email').type('S1sc02131');
            cy.get('input[type="password"]').type('S1sc02131');
            cy.get('button[type="submit"]').click();
            cy.url().should('eq', Cypress.config().baseUrl + 'login');
            cy.contains('Login Gagal').should('be.visible');
            cy.contains('Akun tidak ditemukan atau password salah').should('be.visible');
        });
    });
});