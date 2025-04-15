describe('Landing Page Test', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Cek perilaku user mengakses landing page', () => {
        const headerTexts = ['Presentia', 'Login'];
        headerTexts.forEach(text => {
            cy.get('div.layout-topbar').contains(text).should('be.visible');
        });

        const introContent = [
            'Presentia',
            'Digitalisasi Absensi Sekolah Anda',
            'Optimalkan pengelolaan kehadiran siswa'
        ];
        introContent.forEach(text => {
            cy.contains(text).should('be.visible');
        });
        cy.get('img[alt="hero-1"]').should('be.visible');

        ['Login', 'Daftar'].forEach(label => {
            cy.get('section').contains(label).should('be.visible');
        });

        const cardSections = [
            { title: 'Mengapa Memilih Presentia?', selector: '.grid .col-12', expectedCount: 3 },
            { title: 'Pricing Plans', selector: '.shadow-2', expectedCount: 3 }
        ];

        cardSections.forEach(({ title, selector, expectedCount }) => {
            cy.contains(title)
                .parent()
                .find(selector)
                .should('have.length', expectedCount);
        });

        const endSection = [
            { label: 'PILIH PRESENTIA', type: 'text' },
            { label: 'Daftar Akun Sekarang', type: 'text' },
            { label: 'Daftar Akun', type: 'button' }
        ];

        endSection.forEach(({ label, type }) => {
            if (type === 'text') {
                cy.contains(label).should('be.visible');
            } else if (type === 'button') {
                cy.contains('button', label).should('be.visible');
            }
        });
    });
});