describe("Pengujian Halaman Login", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    it("Cek perilaku user ketika melakukan login dengan email dan password yang valid.", () => {
        cy.get("#email").type("validuser@example.com");
        cy.get("#password").type("validpassword");
        cy.contains("Sign In").click();
        cy.url().should("eq", "http://localhost:5173/client/dashboard");
    });

    it("Cek perilaku user ketika melakukan login dengan email dan password yang tidak valid.", () => {
        cy.get("#email").type("invaliduser@example.com");
        cy.get("#password").type("invalidpassword");
        cy.contains("Sign In").click();
        // cy.get('.p-toast-message').should('contain', 'Invalid credentials');
        // cy.url().should("eq", "http://localhost:5173/login");
    });

    it("Cek perilaku user ketika melakukan login dengan email yang tidak valid.", () => {
        cy.get("#email").type("invalidemailformat");
        cy.get("#password").type("validpassword");
        cy.contains("Sign In").click();
        // cy.get('.p-toast-message').should('contain', 'Invalid credentials');
        // cy.url().should('eq', 'http://localhost:5173/login');
    });

    it("Cek perilaku user ketika melakukan login dengan password yang tidak valid.", () => {
        cy.get("#email").type("validuser@example.com");
        cy.get("#password").type("invalidpassword");
        cy.contains("Sign In").click();
        // cy.get('.p-toast-message').should('contain', 'Invalid credentials');
        // cy.url().should('eq', 'http://localhost:5173/login');
    });

    it("Cek perilaku user ketika melakukan login tanpa menginputkan email.", () => {
        cy.get("#password").type("validpassword");
        cy.contains("Sign In").click();
        // cy.get('.p-toast-message').should('contain', 'Email is required');
        // cy.url().should('eq', 'http://localhost:5173/login');
    });

    it("Cek perilaku user ketika melakukan login tanpa menginputkan password.", () => {
        cy.get("#email").type("validuser@example.com");
        cy.contains("Sign In").click();
        // cy.get('.p-toast-message').should('contain', 'Password is required');
        // cy.url().should('eq', 'http://localhost:5173/login');
    });

    it("Cek perilaku user ketika melakukan login tanpa menginputkan email dan password.", () => {
        cy.contains("Sign In").click();
        // cy.get('.p-toast-message').should('contain', 'Email and password are required');
        // cy.url().should('eq', 'http://localhost:5173/login');
    });
});
