"use strict";
import "cypress-real-events/support";
import 'cypress-wait-until';
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


Cypress.Commands.add('loginAs', (role) => {
    const user = Cypress.env('users')[role];

    if (!user) {
        throw new Error(`Role "${role}" tidak ditemukan di Cypress.env()`);
    }

    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 50000 }).should('include', '/user/dashboard');
    cy.get('.p-toast-message').should('contain', 'Login Berhasil')
        .and('contain', 'Sekarang kamu sudah masuk ke dalam aplikasi')
        .should('be.visible');
});
