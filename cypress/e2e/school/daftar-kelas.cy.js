describe('Pengujian Halaman Daftar Kelas', () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/school/classroom");
    });

    it('Cek tampilan awal halaman manajemen kelas', () => {
        cy.get('h5').should('contain', 'Daftar Kelas');
        cy.get('button').contains('Kelas Baru').should('be.visible');
        // cy.get('button').contains('Hapus').should('be.disabled');
        cy.get('button').contains('Export').should('be.visible');
        cy.get('table').should('be.visible');
    });

    it('Cek perilaku user ketika menambahkan kelas baru', () => {
        cy.get('button').contains('Kelas Baru').click();

        cy.get('div.p-dialog-title').should('contain', 'Tambah Kelas Baru');
        cy.get('input#className').type('Kelas C');
        cy.get('label').contains('Aktif').click();
        cy.get('button').contains('Simpan').click();

        cy.get('table').contains('td', 'Kelas C').should('exist');
        cy.get('table').contains('td', 'Active').should('exist');
    });

    it('Cek perilaku user ketika menghapus kelas', () => {
        cy.get('table').find('tr').eq(1).find('input[type="checkbox"]').check();
        cy.get('button').contains('Hapus').should('not.be.disabled').click();

        cy.on('window:alert', (str) => {
            expect(str).to.equal('Open student list for this class');
        });

        cy.get('table').contains('td', 'Kelas A').should('not.exist');
    });

    it('Cek perilaku user ketika mencari kelas', () => {
        cy.get('input[placeholder="Search..."]').type('Kelas B');
        cy.get('table').contains('td', 'Kelas B').should('exist');
        cy.get('table').contains('td', 'Kelas A').should('not.exist');
    });

    it('Cek tooltips pada jumlah murid', () => {
        cy.get('table').contains('td', '30').trigger('mouseover');
        cy.get('.p-tooltip').should('contain', 'Laki-Laki: 15, Perempuan: 15');
    });
});
