describe('Login Page Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('Menampilkan seluruh elemen halaman login', () => {
        cy.get('h2').contains('Selamat Datang!');
        cy.get('p').contains('Silahkan Log In Untuk Melanjutkan Ke Dashboard');
        cy.get('label').contains('Email');
        cy.get('#email').should('be.visible');
        cy.get('label').contains('Password');
        cy.get('#password').should('be.visible');
        cy.get('label').contains('Save Password?');
        cy.get('button').contains('Sign In').should('be.visible');
        cy.get('button').contains('Sign in with Google').should('be.visible');
    });

    // FR-08
    // TC-.....

    it('User melakukan login menggunakan akun yang belum teregistrasi', () => {
        cy.get('input#email').type('presentia9@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.get('button[type="submit"]').click();

        cy.contains('Login Gagal').should('be.visible');
        cy.contains('Email atau Password salah').should('be.visible');
    });

    // FR-08
    // TC-.....

    it('User melakukan login menggunakan akun yang telah teregistrasi', () => {
        cy.get('input#email').type('presentia1@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/user/dashboard');
        cy.contains('Login Berhasil').should('be.visible');
        cy.contains('Sekarang kamu sudah login').should('be.visible');
    });
});