describe("Pegujian Halaman Daftar Siswa", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173/school/student");
    });

    it("Cek perilaku user ketika membuka halaman data siswa", () => {
        cy.contains("Data Siswa SMK Telkom Bandung").should("be.visible");
        cy.get("table").should("exist");
        cy.get("button").contains("Siswa Baru").should("be.visible");
        cy.get("button").contains("Hapus").should("be.disabled");
    });

    it("Cek perilaku user ketika menambahkan data siswa baru", () => {
        cy.get("button").contains("Siswa Baru").click();
        cy.contains("Penambahan Data Siswa").should("be.visible");

        cy.get("input#nama").type("Novita Sabila");
        cy.get("input#nis").type("1302213030");
        cy.get("input#nisn").type("111302213030");
        cy.get("div.field label").contains("Kelas").parent().find("div").click();
        cy.contains("Kelas A").click();
        cy.get("div.field label").contains("Kelamin").parent().find("div").click();
        cy.contains("Perempuan").click();
        cy.get("#status1").check();

        cy.get("button").contains("Save").click();
        cy.contains("Penambahan Data Siswa").should("not.exist");
        cy.get("table").contains("Novita Sabila").should("exist");
    });

    it("Cek perilaku user ketika melakukan pencarian siswa", () => {
        cy.get('input[placeholder="Search..."]').type("Novita Sabila");
        cy.get("table").contains("Novita Sabila").should("exist");
    });

    it("Cek perilaku user ketika menghapus data siswa", () => {
        cy.get("table").find("tr").eq(1).find('input[type="checkbox"]').check();
        cy.get("button").contains("Hapus").should("not.be.disabled");
        cy.get("button").contains("Hapus").click();
        cy.get("table").contains("Novita Sabila").should("not.exist");
    });

    it("Cek perilaku user ketika menekan tombol export data siswa", () => {
        cy.get("button").contains("Export").click();
        cy.window().then((win) => {
            cy.stub(win.console, "log").as("consoleLog");
        });
    });
});
