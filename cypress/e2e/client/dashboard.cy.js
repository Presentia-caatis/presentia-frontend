describe('Admin School Page Tests', () => {
    beforeEach(() => {
        cy.visit('/client/dashboard');
    });

    it('Menampilkan daftar sekolah', () => {
        cy.get('.p-datatable').should('exist');
        cy.get('.p-datatable-tbody tr').should('have.length.at.least', 1);
    });
});