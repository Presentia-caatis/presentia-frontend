describe('Pengujian Halaman Pencapaian Sekolah', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/school/achievement');
    });

    it('Cek perilaku user ketika membuka halaman pencapaian', () => {
        cy.contains('Daftar Pencapaian').should('be.visible');
        cy.get('table').should('exist');
    });

    it('Cek perilaku user ketika menambahkan pencapaian baru', () => {
        cy.get('.p-button-success').click();

        cy.get('#name').type('Pencapaian C');
        cy.get('#description').type('Menang lomba coding');
        cy.get('#code').type('C30');
        cy.get('#grade').clear().type('95');
        cy.get('input[name="status"][value="Active"]').click(); 

        cy.contains('Simpan').click();

        cy.contains('Pencapaian C').should('be.visible');
        cy.contains('Menang lomba coding').should('be.visible');
    });

    it('Cek perilaku user ketika memilih pencapaian', () => {
        cy.get('table').find('tbody tr').first().click();
        cy.get('table').find('tbody tr').first().should('have.class', 'p-highlight');
    });

    it('Cek perilaku user ketika menghapus pencapaian yang dipilih', () => {
        cy.get('table').find('tbody tr').first().click();
        cy.get('.p-button-danger').click();
        cy.get('table').find('tbody tr').first().should('not.exist');
    });

    it('Cek perilaku user ketika mengupdate pencapaian', () => {
        cy.get('table').find('tbody tr').first().click();
        cy.get('.p-button-success').first().click();
        cy.get('#name').clear().type('Pencapaian C Updated');
        cy.get('#description').clear().type('Menang lomba programming');
        cy.get('#grade').clear().type('98');
        cy.contains('Simpan').click();

        cy.contains('Pencapaian C Updated').should('be.visible');
        cy.contains('Menang lomba programming').should('be.visible');
    });

    it('Cek perilaku user ketika mencari pencapaian', () => {
        cy.get('input[placeholder="Search..."]').type('Pencapaian A');

        cy.contains('Pencapaian A').should('be.visible');
        cy.contains('Pencapaian B').should('not.exist');
    });
});
