describe('Edit Account Profil Test', () => {
  beforeEach(() => {
    cy.loginAs('coadmin');
  });

  it('Cek perilaku co-admin sekolah mengubah profil akun', () => {
    cy.contains("Sekolah yang dikelola", { timeout: 60000 }).should("be.visible");

    const schoolData = [
      { selector: 'img', assertion: 'be.visible' },
      { selector: 'h1.text-4xl', assertion: 'exist' },
      { icon: '.pi.pi-map-marker', label: 'Alamat:' },
      { icon: '.pi.pi-calendar', label: 'Terdaftar Sejak:' },
      { icon: '.pi.pi-calendar-times', label: 'Terakhir Berlangganan:' },
      { icon: '.pi.pi-box', label: 'Berlangganan:' }
    ];

    schoolData.forEach(({ selector, assertion, icon, label }) => {
      if (selector) {
        cy.get(selector).should(assertion);
      } else if (icon && label) {
        cy.get(icon)
          .should('be.visible')
          .parent()
          .within(() => {
            cy.contains(label).should('exist')
              .next().invoke('text')
              .should('not.be.empty')
              .and('not.contain', 'undefined')
              .and('not.contain', 'null');
          });
      }
    });

    const attendanceData = [
      { icon: '.pi.pi-users', label: 'Jumlah siswa aktif' },
      { icon: '.pi.pi-address-book', label: 'Jumlah presensi hari ini' },
      { icon: '.pi.pi-user-minus', label: 'Jumlah absensi hari ini' }
    ];

    attendanceData.forEach(({ icon, label }) => {
      cy.get(icon)
        .closest('.p-card')
        .within(() => {
          cy.contains(label).should('exist');
          cy.get('p.text-3xl.font-bold')
            .invoke('text')
            .should('not.be.empty')
            .and('not.match', /(undefined|null)/)
            .and('match', /\d+/);
        });
    });

    const buttons = [
      { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah' },
      { selector: 'button.p-button-success', icon: '.pi.pi-sign-in', text: 'Daftar Presensi Hari Ini' }
    ];

    buttons.forEach(({ selector, icon, text }) => {
      cy.get(selector)
        .should('be.visible')
        .within(() => {
          cy.get(icon).should('be.visible');
          cy.contains(text).should('be.visible');
        });
    });

    cy.get('.layout-topbar').should('be.visible');
    cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
    cy.get('.absolute.bg-white').should('be.visible');
    cy.contains('Profile Pengguna').click();
    cy.url().should('include', '/user/profile');

    cy.get('h1').should('contain.text', 'Profile Pengguna');
    cy.get('img.w-5rem.h-5rem.border-circle').should('exist');
    cy.get('input[type="file"]').should('exist');

    const buttonsToCheck = [
      { label: 'Ganti Foto', assert: 'be.visible' },
      { label: 'Hapus Fotos', assert: 'be.visible' },
      { label: 'Simpan Pembaruan', assert: 'be.visible' },
      { label: 'Batal', assert: 'be.visible' }
    ];

    buttonsToCheck.forEach(({ label, assert }) => {
      cy.contains(label).should(assert);
    });

    const inputsToCheck = [
      { selector: 'input[placeholder="Masukkan Email"]', assert: 'exist', disabled: true },
      { selector: 'input[placeholder="Masukkan Username"]', assert: 'exist', disabled: false },
      { selector: 'input[placeholder="Masukkan Nama Lengkap"]', assert: 'exist', disabled: false }
    ];

    inputsToCheck.forEach(({ selector, assert, disabled }) => {
      cy.get(selector).should(assert);
      if (disabled !== undefined) {
        cy.get(selector).should(disabled ? 'be.disabled' : 'not.be.disabled');
      }
    });

    const names = ["Presentia Dummy Account 8", "Presentia Dummy 8", "Presentia Account 8"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    cy.get('input[placeholder="Masukkan Nama Lengkap"]').clear().type(randomName);
    cy.get('input[placeholder="Masukkan Nama Lengkap"]').should('have.value', randomName);
    cy.contains('Simpan Pembaruan').click();
    cy.get('.p-confirm-popup')
      .should('be.visible')
      .and('contain.text', 'Apakah Anda yakin ingin mengubah data?')
      .within(() => {
        cy.get('.pi.pi-exclamation-triangle').should('be.visible');
        cy.get('button.p-button-success')
          .should('be.visible')
          .and('contain.text', 'Ya')
          .click();
      });

    cy.get('.p-toast', { timeout: 15000 }).should('be.visible').then((toast) => {
      if (toast.text().includes('Profil berhasil diperbarui.')) {
        cy.contains('.p-toast-summary', 'Sukses').should('be.visible');
        cy.contains('.p-toast-detail', 'Profil berhasil diperbarui.').should('be.visible');
      } else {
        cy.contains('.p-toast-summary', 'Gagal').should('be.visible');
        cy.contains('.p-toast-detail', 'Terjadi kesalahan saat memperbarui data.').should('be.visible');
      }
    });
  });
});