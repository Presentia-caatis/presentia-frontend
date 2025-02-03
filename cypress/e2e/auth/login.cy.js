describe('Pengujian Halaman Login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
    });

    it('Cek perilaku user ketika login menggunakan akun terdaftar', () => {
        cy.get('#email_or_username').type('presentia@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', 'http://localhost:5173/client/dashboard');
        cy.get('.p-toast-summary').should('contain', 'Login Success');
    });

    it('Cek perilaku user ketika login menggunakan akun Google', () => {
        cy.contains('Sign in with Google').click();
        cy.url().should('include', 'google.com');
    });

    it('Cek perilaku user ketika reset password akun', () => {
        cy.contains('Forgot Password?').click();

        cy.get('#email').type('testuser@example.com');
        cy.get('button[type="submit"]').click();

        cy.get('.p-toast-summary').should('contain', 'Password reset link sent');
    });

    it('Cek perilaku user ketika logout dari dashboard', () => {
        cy.get('#email_or_username').type('presentia@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', 'http://localhost:5173/client/dashboard');

        cy.contains('Logout').click();

        cy.url().should('include', 'http://localhost:5173/login');
    });
});




// describe("Pengujian Halaman Login", () => {
//     beforeEach(() => {
//         cy.visit("/login");
//     });

//     it("Cek perilaku user ketika melakukan login dengan email dan password yang valid.", () => {
//         cy.get("#email").type("validuser@example.com");
//         cy.get("#password").type("validpassword");
//         cy.contains("Sign In").click();
//         cy.url().should("eq", "http://localhost:5173/client/dashboard");
//     });

//     it("Cek perilaku user ketika melakukan login dengan email dan password yang tidak valid.", () => {
//         cy.get("#email").type("invaliduser@example.com");
//         cy.get("#password").type("invalidpassword");
//         cy.contains("Sign In").click();
//         // cy.get('.p-toast-message').should('contain', 'Invalid credentials');
//         // cy.url().should("eq", "http://localhost:5173/login");
//     });

//     it("Cek perilaku user ketika melakukan login dengan email yang tidak valid.", () => {
//         cy.get("#email").type("invalidemailformat");
//         cy.get("#password").type("validpassword");
//         cy.contains("Sign In").click();
//         // cy.get('.p-toast-message').should('contain', 'Invalid credentials');
//         // cy.url().should('eq', 'http://localhost:5173/login');
//     });

//     it("Cek perilaku user ketika melakukan login dengan password yang tidak valid.", () => {
//         cy.get("#email").type("validuser@example.com");
//         cy.get("#password").type("invalidpassword");
//         cy.contains("Sign In").click();
//         // cy.get('.p-toast-message').should('contain', 'Invalid credentials');
//         // cy.url().should('eq', 'http://localhost:5173/login');
//     });

//     it("Cek perilaku user ketika melakukan login tanpa menginputkan email.", () => {
//         cy.get("#password").type("validpassword");
//         cy.contains("Sign In").click();
//         // cy.get('.p-toast-message').should('contain', 'Email is required');
//         // cy.url().should('eq', 'http://localhost:5173/login');
//     });

//     it("Cek perilaku user ketika melakukan login tanpa menginputkan password.", () => {
//         cy.get("#email").type("validuser@example.com");
//         cy.contains("Sign In").click();
//         // cy.get('.p-toast-message').should('contain', 'Password is required');
//         // cy.url().should('eq', 'http://localhost:5173/login');
//     });

//     it("Cek perilaku user ketika melakukan login tanpa menginputkan email dan password.", () => {
//         cy.contains("Sign In").click();
//         // cy.get('.p-toast-message').should('contain', 'Email and password are required');
//         // cy.url().should('eq', 'http://localhost:5173/login');
//     });
// });
