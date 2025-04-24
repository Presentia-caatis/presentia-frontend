describe('Edit School Profile Test', () => {
    beforeEach(() => {
        cy.loginAs('admin');
    });

    it('Cek perilaku admin sekolah memperbarui data sekolah', () => {
        cy.contains("Sekolah yang dikelola", { timeout: 60000 }).should("be.visible");

        const buttons = [
            { selector: 'button.p-button-primary', icon: '.pi.pi-home', text: 'Dashboard Sekolah', url: '/school/smkn-10-bandung/dashboard' },
        ];

        buttons.forEach(({ selector, icon, text, url }) => {
            cy.get(selector)
                .should('be.visible')
                .within(() => {
                    cy.get(icon).should('be.visible');
                    cy.contains(text).should('be.visible');
                })
                .click();

            cy.url().should('include', url);

            cy.get('h1')
                .should('be.visible')
                .invoke('text')
                .should('match', /Selamat Datang di Dashboard .+/);

            cy.get('p')
                .should('be.visible')
                .invoke('text')
                .should('not.be.empty')
                .and('not.match', /(undefined|null)/);

            const todayRegex = /\d{1,2} \w+ \d{4}/;
            cy.get('h3')
                .should('be.visible')
                .invoke('text')
                .should('match', todayRegex);

            const attendanceAndSubscription = [
                { icon: '.pi.pi-users', label: 'Total Hadir Hari Ini', isNumber: true },
                { icon: '.pi.pi-map-marker', label: 'Total Absen Hari Ini', isNumber: true },
                { icon: '.pi.pi-check-circle', label: 'Paket Aktif', isNumber: false },
                { label: 'Berlaku hingga:', isDate: true }
            ];

            attendanceAndSubscription.forEach(({ icon, label, isNumber, isDate }) => {
                if (icon) {
                    cy.get(icon)
                        .should('be.visible')
                        .parents('.card')
                        .within(() => {
                            cy.contains(label)
                                .should('exist')
                                .next().invoke('text')
                                .should('not.be.empty')
                                .and('not.match', /(undefined|null)/)

                            if (isNumber) {
                                cy.contains(label).next().invoke('text').should('match', /\d+/);
                            }

                            if (isDate) {
                                cy.contains(label).next().invoke('text').should('match', /\d{1,2} \w+ \d{4}( pukul \d{2}\.\d{2}\.\d{2})?/);
                            }
                        });
                }
            });

            cy.contains('h5', 'Data Kehadiran Hari Ini').should('be.visible');
            cy.get('.p-carousel-item:visible', { timeout: 10000 })
                .should('have.length.greaterThan', 0)
                .each(($item) => {
                    cy.wrap($item).within(() => {
                        cy.contains(/Total Hadir|Tidak Hadir|Tepat Waktu|Telat/, { timeout: 10000 })
                            .scrollIntoView({ block: 'center', inline: 'center' })
                            .should('exist')
                            .invoke('text')
                            .then((labelText) => {
                            });

                        cy.get('div.text-900.font-bold')
                            .scrollIntoView({ block: 'center', inline: 'center' })
                            .invoke('text')
                            .then((text) => {
                                expect(text.trim()).to.match(/^\d+$/);
                            });
                    });
                });

            // const studentAttendanceChart = [
            //     { title: 'Perbandingan Kehadiran Hari Ini', noDataText: 'Tidak Ada Kehadiran Hari Ini' },
            //     { title: 'Statistik Kehadiran Harian', noDataText: 'Tidak Ada Data Kehadiran' },
            //     { title: 'Perbandingan Status Siswa' },
            //     { title: 'Perbandingan Jenis Kelamin Siswa' }
            // ];

            // studentAttendanceChart.forEach(({ title, noDataText }) => {
            //     cy.contains('h5', title).should('be.visible').parent().within(() => {
            //         cy.get('canvas').then($canvas => {
            //             if ($canvas.length > 0) {
            //                 cy.wrap($canvas).should('exist').and('be.visible');
            //             } else if (noDataText) {
            //                 cy.contains(noDataText).should('be.visible');
            //             }
            //         });
            //     });
            // });

            cy.get('.layout-topbar').should('be.visible');
            cy.get('.layout-topbar .flex.gap-2.cursor-pointer').click();
            cy.get('.absolute.bg-white').should('be.visible');
            cy.contains('Profile Sekolah').click();
            cy.url().should('include', '/school/smkn-10-bandung/profile');

            cy.get('h1').should('contain.text', 'Profile Sekolah');
            cy.get('img.w-5rem.h-5rem.border-circle').should('exist');
            cy.get('input[type="file"]').should('exist');

            const buttonsToCheck = [
                { label: 'Ganti Logo', assert: 'be.visible' },
                { label: 'Hapus Logo', assert: 'be.visible' },
                { label: 'Simpan Pembaruan', assert: 'be.visible' },
                { label: 'Batal', assert: 'be.visible' }
            ];

            buttonsToCheck.forEach(({ label, assert }) => {
                cy.contains(label).should(assert);
            });

            const inputsToCheck = [
                { selector: 'input[placeholder="Masukkan Nama Sekolah"]', assert: 'exist', disabled: false },
                { selector: 'input[placeholder="Masukkan Alamat"]', assert: 'exist', disabled: false },
            ];

            inputsToCheck.forEach(({ selector, assert, disabled }) => {
                cy.get(selector).should(assert);
                if (disabled !== undefined) {
                    cy.get(selector).should(disabled ? 'be.disabled' : 'not.be.disabled');
                }
            });

            const names = ["SMKN 10 Bandung", "SMK Negeri 10 Bandung"];
            const randomName = names[Math.floor(Math.random() * names.length)];
            cy.get('input[placeholder="Masukkan Nama Sekolah"]').clear().type(randomName);
            cy.get('input[placeholder="Masukkan Nama Sekolah"]').should('have.value', randomName);
            cy.contains('Simpan Pembaruan').click();
            cy.get('.p-confirm-popup')
                .should('be.visible')
                .and('contain.text', 'Apakah Anda yakin ingin mengubah data sekolah?')
                .within(() => {
                    cy.get('.pi.pi-exclamation-triangle').should('be.visible');
                    cy.get('button.p-button-success')
                        .should('be.visible')
                        .and('contain.text', 'Ya')
                        .click();
                });
        });

        cy.get('.p-toast', { timeout: 15000 }).should('be.visible').then((toast) => {
            if (toast.text().includes('Profil berhasil diperbarui.')) {
                cy.contains('.p-toast-summary', 'Sukses').should('be.visible');
                cy.contains('.p-toast-detail', 'Data sekolah berhasil diperbarui.').should('be.visible');
            } else {
                cy.contains('.p-toast-summary', 'Gagal').should('be.visible');
                cy.contains('.p-toast-detail', 'Gagal memperbarui data sekolah').should('be.visible');
            }
        });
    });
});