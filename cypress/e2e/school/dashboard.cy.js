describe('Dashboard Page Tests', () => {
  it('Login dan Verifikasi Halaman Dashboard Sekolah', () => {
    cy.visit('/login');

    cy.get('input#email').type('presentia1@gmail.com');
    cy.get('input[type="password"]').type('12345678');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/user/dashboard');

    cy.contains('Login Berhasil').should('be.visible');
    cy.contains('Sekarang kamu sudah login').should('be.visible');

    cy.wait(5000);

    cy.contains('Sekolah yang dikelola', { timeout: 10000 }).should('be.visible');
    cy.get('img').should('be.visible');
    cy.get('h1').should('have.class', 'text-4xl');
    cy.get('.pi.pi-info-circle').parent().contains('Status').next().invoke('text').should('not.be.empty').and('not.contain', 'undefined').and('not.contain', 'null');
    cy.get('.pi.pi-map-marker').parent().contains('Alamat').next().invoke('text').should('not.be.empty').and('not.contain', 'undefined').and('not.contain', 'null');
    cy.get('.pi.pi-calendar').parent().contains('Terdaftar Sejak').next().invoke('text').should('not.be.empty').and('not.contain', 'undefined').and('not.contain', 'null');
    cy.get('.pi.pi-calendar-times').parent().contains('Terakhir Berlangganan').next().invoke('text').should('not.be.empty').and('not.contain', 'undefined').and('not.contain', 'null');
    cy.get('.pi.pi-box').parent().contains('Paket').next().invoke('text').should('not.be.empty').and('not.contain', 'undefined').and('not.contain', 'null');

    cy.get('.pi.pi-users')
      .closest('.p-card')
      .should('contain.text', 'Jumlah siswa aktif')
      .find('p.text-3xl.font-bold')
      .invoke('text')
      .should('match', /\d+/);

    cy.get('.pi.pi-address-book')
      .closest('.p-card')
      .should('contain.text', 'Jumlah presensi hari ini')
      .find('p.text-3xl.font-bold')
      .invoke('text')
      .should('match', /\d+/);

    cy.get('.pi.pi-user-minus')
      .closest('.p-card')
      .should('contain.text', 'Jumlah absensi hari ini')
      .find('p.text-3xl.font-bold')
      .invoke('text')
      .should('match', /\d+/);

    cy.get('button.p-button-primary')
      .contains('Dashboard Sekolah')
      .should('be.visible')
      .parent()
      .find('.pi.pi-home')
      .should('be.visible');

    cy.get('button.p-button-primary')
      .contains('Dashboard Sekolah')
      .click();

    cy.url().should('include', 'school/smkn-10-bandung/dashboard');
    cy.get('h1').should('contain.text', 'Selamat Datang di Dashboard');
    cy.get('p').should('contain.text', 'Jl. Cijawura Hilir No.339, Cijaura, Buahbatu, Kota Bandung, Jawa Barat 40286, Indonesia');

    const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    cy.get('h3').should('contain.text', today);

    cy.contains('Total Hadir Hari Ini').should('exist').and('not.be.empty');
    cy.contains('Total Absen Hari Ini').should('exist').and('not.be.empty');
    cy.contains('Paket Aktif').should('exist').and('not.be.empty');

    cy.contains('Fitur presensi').should('exist');
    cy.contains('Fingerprint').should('exist');

    cy.contains('Fingerprint')
      .parent()
      .find('.p-togglebutton')
      .as('toggleButton');

    // Cek apakah tombol dalam keadaan ON
    cy.get('@toggleButton').then(($btn) => {
      if ($btn.find('.pi-power-on').length > 0) {
        // Jika ON, klik untuk OFF
        cy.get('@toggleButton').click();
        cy.wait(500); // Tunggu animasi selesai
      }
    });

    // Pastikan tombol dalam keadaan OFF
    cy.get('@toggleButton').find('.pi-power-off').should('exist');

    // Klik lagi untuk mengembalikan ke ON
    cy.get('@toggleButton').click();
    cy.wait(500);

    // Pastikan tombol sudah kembali ON
    cy.get('@toggleButton').find('.pi-power-on').should('exist');

    cy.contains('Perbandingan Kehadiran Hari Ini').parent().find('canvas').should('exist');
    cy.contains('Perbandingan Status siswa terdaftar').parent().find('canvas').should('exist');
    cy.contains('Perbandingan Gender Siswa').parent().find('canvas').should('exist');

  });
});
