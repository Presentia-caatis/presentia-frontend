describe('Pengujian Halaman Daftar Pencapaian Siswa', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/school/achievement/student');
    });

    it('Cek perilaku user ketika membuka halaman dan melihat data siswa', () => {
        cy.get('table').should('be.visible');
        cy.get('th').contains('Nama').should('be.visible');
        cy.get('th').contains('NIS').should('be.visible');
        cy.get('th').contains('NISN').should('be.visible');
        cy.get('th').contains('Kelamin').should('be.visible');
        cy.get('th').contains('Kelas').should('be.visible');
    });

    it('Cek perilaku user ketika mengklik tombol tambah pencapaian siswa', () => {
        cy.contains('Pencapaian Siswa').click();

        cy.get('div.p-dialog').should('be.visible');
        cy.get('label').contains('Pencapaian').should('be.visible');
        cy.get('label').contains('Siswa').should('be.visible');
        cy.get('label').contains('Deskripsi').should('be.visible');
    });

    it('Cek perilaku user ketika memilih pencapaian dan siswa', () => {
        cy.contains('Pencapaian Siswa').click();

        cy.get('label').contains('Pencapaian').parent().find('input').click();
        cy.contains('Pencapaian A').click();

        cy.get('label').contains('Siswa').parent().find('input').click();
        cy.contains('John John John - 67890 - Kelas A').click();

        cy.get('label').contains('Deskripsi').parent().find('textarea').type('Siswa berprestasi di bidang A');

        cy.get('button').contains('Save').click();

        cy.get('div.p-dialog').should('not.be.visible');
    });

    it('Cek perilaku user ketika melihat detail pencapaian siswa', () => {
        cy.get('button').contains('Lihat Pencapaian').first().click();

        cy.get('div.p-dialog').should('be.visible');
        cy.get('h5').contains('Data Pencapaian SMAN 24').should('be.visible');

        cy.get('table').should('be.visible');
        cy.get('th').contains('Name').should('be.visible');
        cy.get('th').contains('Kode Pencapaian').should('be.visible');
        cy.get('th').contains('Deskripsi').should('be.visible');
        cy.get('th').contains('Score').should('be.visible');
    });

    // it('Cek perilaku user ketika menghapus pencapaian siswa', () => {
    //   cy.get('button').contains('Lihat Pencapaian').first().click();

    //   cy.get('button.p-button-rounded').contains('Delete').should('be.visible');

    //   cy.get('button.p-button-rounded').contains('Delete').first().click();

    //   cy.get('.p-confirm-popup').should('be.visible');

    //   cy.get('button').contains('Yes').click();

    //   cy.get('table').should('not.contain', 'Pencapaian A');
    // });
});
