describe('Failed to Add Student Data Test', () => {
    const school = Cypress.env('schoolName');
    const schoolName = 'SMK Telkom Bandung';
    const roles = ['superadmin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'superadmin' ? 'superadmin'
            : role} tidak dapat menambahkan data siswa`, () => {
                cy.loginAs(role);
                cy.contains("Selamat datang di dashboard admin").should("be.visible");

                cy.get('.layout-sidebar').should('be.visible');
                cy.get('.layout-sidebar').contains('Daftar Sekolah').click();
                cy.url().should('include', '/admin/school');

                cy.get('table').should('be.visible');
                cy.contains('td', schoolName).should('be.visible');
                cy.contains('td', schoolName)
                    .parents('tr')
                    .within(() => {
                        cy.contains('button', 'Masuk').click();
                    });
                cy.url().should('include', `/school/${school}/dashboard`);

                cy.get('.layout-sidebar').should('be.visible');
                cy.get('.layout-sidebar').contains('Daftar Siswa').click();
                cy.url().should('include', `/school/${school}/student`);

                cy.get('.card').first().should('exist').and('be.visible');
                cy.get('.card h1')
                    .should('contain.text', 'Daftar Siswa')
                    .invoke('text')
                    .should('match', /^Daftar Siswa\s+\S+/);

                const buttons = [
                    { label: 'Siswa Baru', icon: '.pi.pi-plus', shouldBeDisabled: false },
                    { label: 'Import', icon: '.pi.pi-upload', shouldBeDisabled: false },
                    { label: 'Hapus', icon: '.pi.pi-trash', shouldBeDisabled: true },
                    { label: 'Export', icon: '.pi.pi-upload', shouldBeDisabled: false }
                ];

                buttons.forEach(({ label, icon, shouldBeDisabled }) => {
                    cy.contains('button', label)
                        .should('be.visible')
                        .within(() => {
                            cy.get(icon).should('be.visible');
                        });

                    if (shouldBeDisabled !== undefined) {
                        cy.contains('button', label).should(shouldBeDisabled ? 'be.disabled' : 'not.be.disabled');
                    }
                });

                cy.get('table').should('be.visible');
                cy.contains('Memuat data siswa...').should('not.exist');
                cy.get('.card h5')
                    .should('contain.text', 'Data Siswa')
                    .invoke('text')
                    .should('match', /^Data Siswa\s+\S+/);
                cy.get('.p-input-icon-left input[placeholder="Search..."]').should('exist');

                cy.contains('Siswa Baru').click();
                cy.get('.p-dialog').should('be.visible');
                cy.get('.p-dialog .p-dialog-title').should('have.text', 'Penambahan Data Siswa');

                const labels = ['Nama', 'NIS', 'NISN', 'Kelas', 'Jenis Kelamin', 'Status Siswa'];

                labels.forEach(label => {
                    cy.contains('label', label).should('be.visible');
                });

                const names = ["Siswa Sekolah Satu", "Siswa Sekolah Dua", "Siswa Sekolah Tiga", "Siswa Sekolah Empat"];
                const randomName = names[Math.floor(Math.random() * names.length)];

                cy.get('input#nama').type(randomName);
                cy.get('input#nis').clear();
                cy.get('input#nisn').clear().type('1234567890');

                cy.get('.p-dialog:visible').contains('label', 'Kelas')
                    .parent()
                    .find('.p-dropdown')
                    .click();
                cy.get('.p-dropdown-panel:visible .p-dropdown-item')
                    .then($kelas => {
                        const randomIndex = Math.floor(Math.random() * $kelas.length);
                        cy.wrap($kelas[randomIndex]).scrollIntoView().click();
                    });

                cy.get('.p-dialog:visible').contains('label', 'Jenis Kelamin')
                    .parent()
                    .find('.p-dropdown')
                    .click();
                cy.get('.p-dropdown-panel:visible .p-dropdown-item')
                    .then($gender => {
                        const randomIndex = Math.floor(Math.random() * $gender.length);
                        cy.wrap($gender[randomIndex]).scrollIntoView().click();
                    });

                cy.get('input#status1').should('be.checked');

                cy.get('.p-dialog:visible').contains('button', 'Save')
                    .should('exist')
                    .and('be.disabled');
            });
    });
});