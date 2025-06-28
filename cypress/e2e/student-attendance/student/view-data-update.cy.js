describe('Student Attendance Page Test', () => {
    const roles = ['admin'];

    roles.forEach((role) => {
        it(`Cek perilaku ${role === 'admin' ? 'siswa'
            : role} melihat update data presensi`, () => {
                cy.loginAs(role);
                cy.contains("Sekolah yang dikelola").should("be.visible");

                const buttons = [
                    { selector: 'button.p-button-success', icon: '.pi.pi-sign-in', text: 'Daftar Presensi Hari Ini', url: '/school/attendance' }
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

                    cy.get('[class*="text-6xl font-bold"]')
                        .should('be.visible')
                        .and('not.contain', 'Loading...')
                        .invoke('text')
                        .then((schoolName) => {
                            cy.title().should('eq', schoolName.trim() || 'Presentia');
                        });

                    cy.get('img[alt="Logo Sekolah"]').should('be.visible');

                    cy.get('button[aria-label="Back"]')
                        .should('exist')
                        .and('have.class', 'p-button-text p-button-plain')
                        .within(() => {
                            cy.get('span.pi-arrow-left').should('exist');
                        });

                    cy.contains('Kembali ke Dashboard').should('exist');

                    cy.get('button.p-button-primary')
                        .filter(':contains("Refresh")')
                        .within(() => {
                            cy.get('span.pi-refresh').should('exist');
                        });

                    cy.get('#countdown-tooltip')
                        .should('exist')
                        .and('have.class', 'w-3rem text-xl cursor-pointer transition-all');

                    cy.get('button.p-button-primary, button.p-button-secondary')
                        .filter(':contains("Ganti Otomatis")')
                        .should('exist');

                    cy.get('h5')
                        .should('be.visible')
                        .invoke('text')
                        .should((text) => {
                            expect(text).to.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
                        });

                    cy.get('p').first()
                        .should('be.visible')
                        .invoke('text')
                        .should((text) => {
                            expect(text).to.match(/^\d{2}\.\d{2}\.\d{2}$/);
                        });

                    cy.contains('Tidak Ada Event').then(($tag) => {
                        if ($tag.length) {
                            cy.get('.text-sm.text-secondary').should('not.exist');
                        } else {
                            cy.contains('Sedang Event').should('be.visible');
                            cy.get('.text-sm.text-secondary').should('be.visible');
                        }
                    });

                    cy.get('.p-tabmenu').within(() => {
                        cy.get('li').eq(0).should('contain', 'Presensi Masuk').click();
                    });
                    cy.wait(1000);

                    cy.get('h2').should('contain', 'Daftar presensi masuk siswa');
                    cy.get('p.text-2xl.font-bold.text-black-alpha-90')
                        .should('be.visible')
                        .invoke('text')
                        .then((text) => {
                            const formattedText = text.replace(/\s+/g, ' ').trim();
                            const regex = /Waktu presensi:\s*(?:\d{2}\.\d{2}\.\d{2}|Loading\.\.\.)\s*-\s*(?:\d{2}\.\d{2}\.\d{2}|Loading\.\.\.)/;
                            expect(formattedText).to.match(regex);
                        });

                    cy.contains('Memuat data kehadiran...').should('not.exist');
                    cy.get('.p-datatable tbody').then(($tbody) => {
                        if ($tbody.find('tr').length === 0 || $tbody.text().includes('Belum ada data kehadiran')) {
                            cy.contains('Belum ada data kehadiran').should('be.visible');
                            cy.contains('Silakan lakukan presensi terlebih dahulu.').should('be.visible');
                        } else {
                            cy.get('.p-datatable tbody tr').first().find('td').each(($td, colIndex) => {
                                const textValue = $td.text().trim();

                                cy.wrap(null).then(() => {
                                    if (colIndex === 0) {
                                        expect(textValue).to.match(/^\d+$/);
                                    } else if (colIndex === 1) {
                                        expect(textValue).to.match(/\S+/);
                                    } else if (colIndex === 2) {
                                        expect(textValue).to.match(/^(\d{2}\.\d{2}\.\d{2}|Belum Absen)$/);
                                    } else if (colIndex === 3) {
                                        expect(textValue).to.match(/^(Hadir|Alpha|Izin|Sakit|Tidak Hadir|Telat)$/);
                                    }
                                });
                            });
                        }
                    });

                    cy.get('.p-tabmenu li').contains('Presensi Pulang').click();
                    cy.wait(1000);

                    cy.get('h2').should('contain', 'Daftar presensi pulang siswa');
                    cy.get('p.text-2xl.font-bold.text-black-alpha-90')
                        .should('be.visible')
                        .invoke('text')
                        .then((text) => {
                            const formattedText = text.replace(/\s+/g, ' ').trim();
                            const regex = /Waktu presensi:\s*(?:\d{2}\.\d{2}\.\d{2}|Loading\.\.\.)\s*-\s*(?:\d{2}\.\d{2}\.\d{2}|Loading\.\.\.)/;
                            expect(formattedText).to.match(regex);
                        });

                    cy.contains('Memuat data kehadiran...').should('not.exist');

                    cy.get('.p-datatable tbody').then(($tbody) => {
                        if ($tbody.find('tr').length === 0 || $tbody.text().includes('Belum ada data kehadiran')) {
                            cy.contains('Belum ada data kehadiran').should('be.visible');
                            cy.contains('Silakan lakukan presensi terlebih dahulu.').should('be.visible');
                        } else {
                            cy.get('.p-datatable tbody tr').first().find('td').each(($td, colIndex) => {
                                const textValue = $td.text().trim();

                                cy.wrap(null).then(() => {
                                    if (colIndex === 0) {
                                        expect(textValue).to.match(/^\d+$/);
                                    } else if (colIndex === 1) {
                                        expect(textValue).to.match(/\S+/);
                                    } else if (colIndex === 2) {
                                        expect(textValue).to.match(/^(\d{2}\.\d{2}\.\d{2}|Belum Absen)$/);
                                    } else if (colIndex === 3) {
                                        expect(textValue).to.match(/^(Hadir|Alpha|Izin|Sakit|Tidak Hadir)$/);
                                    }
                                });
                            });
                        }
                    });
                });
            });
    });
});