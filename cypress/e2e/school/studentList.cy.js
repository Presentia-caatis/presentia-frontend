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
    cy.get('.layout-sidebar', { timeout: 10000 }).should('be.visible');
    cy.get('.layout-sidebar').contains('Daftar Siswa').click();
    cy.url().should('include', '/school/smkn-10-bandung/student');
  });
});
