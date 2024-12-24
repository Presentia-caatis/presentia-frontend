describe("Pengujian Halaman Dashboard Admin Sekolah", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/school/mainpage");
    });

    it("Cek perilaku user ketika dapat melihat jumlah kehadiran sis", () => {
        cy.contains("Total Siswa Aktif").should("be.visible");
        cy.contains("150").should("be.visible");

        cy.contains("Total Absen Hari Ini").should("be.visible");
        cy.contains("150").should("be.visible");

        cy.contains("Total Daftar Pencapaian").should("be.visible");
        cy.contains("150").should("be.visible");

        cy.contains("Total Daftar Pelanggaran").should("be.visible");
        cy.contains("150").should("be.visible");
    });

    it("Cek perilaku user ketika dapat melihat statistik data kehadiran siswa", () => {
        cy.contains("Selamat Datang Di MainPage SMK Telkom Bandung").should(
            "be.visible"
        );

        cy.contains("Perbandingan Keaktifan status siswa").should("be.visible");
        cy.get("canvas").should("have.length.gte", 1);

        cy.contains("Perbandingan Kehadiran").should("be.visible");
        cy.get("canvas").should("have.length.gte", 2);

        cy.contains("Perbandingan pencapaian dan pelanggaran").should("be.visible");
        cy.get("canvas").should("have.length.gte", 3);

        cy.contains("Perbandingan Gender Siswa").should("be.visible");
        cy.get("canvas").should("have.length.gte", 4);
    });
});
