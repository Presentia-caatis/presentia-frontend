describe('Pengujian Halaman Dashboard Client', () => {
    beforeEach(() => {
        localStorage.setItem('token', 'dummy_token');
        cy.visit('http://localhost:5173/client/dashboard');
    });

    it('Cek perilaku user ketika membuka halaman dashboard', () => {
        cy.contains('Sekolah Harapan Bangsa').should('be.visible');
        cy.contains('Total Siswa Aktif').should('be.visible');
        cy.contains('Total Siswa Baru').should('be.visible');
        cy.contains('Total Kelas Baru').should('be.visible');
    });

    it('Cek perilaku user ketika mengklik tombol "Dashboard Sekolah"', () => {
        cy.contains('Dashboard Sekolah').click();
        cy.url().should('include', '/school/1/mainpage');
    });

    it('Cek perilaku user ketika mengklik tombol "Absen Masuk"', () => {
        cy.contains('Absen Masuk').click();
        cy.url().should('include', '/school/1/student/attendance/in');
    });

    it('Cek perilaku user ketika mengklik tombol "Absen Keluar"', () => {
        cy.contains('Absen Keluar').click();
        cy.url().should('include', '/school/1/student/attendance/out');
    });

    it('Cek perilaku user ketika melihat daftar absen masuk siswa', () => {
        cy.contains('Daftar Absen Masuk Siswa').should('be.visible');
        cy.contains('John Doe').should('exist');
        cy.contains('08:10').should('exist');
    });

    it('Cek perilaku user ketika mengarahkan kursor ke event tooltip', () => {
        cy.get('#event-tooltip').trigger('mouseover');
        cy.get('.p-tooltip').should('contain', 'Event: Pekan Kreativitas');
    });
});
