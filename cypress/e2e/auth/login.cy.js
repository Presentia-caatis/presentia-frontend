describe('Login Page Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('User berhasil login dengan email dan password yang benar', () => {
        cy.get('input#email').type('presentia1@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/user/dashboard');
        cy.contains('Login Berhasil').should('be.visible');
        cy.contains('Sekarang kamu sudah login').should('be.visible');
    });

    it('User gagal login dengan kredensial yang salah', () => {
        cy.get('input#email').type('presentia9@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.get('button[type="submit"]').click();

        cy.contains('Login Gagal').should('be.visible');
        cy.contains('Email atau Password salah').should('be.visible');
    });
});