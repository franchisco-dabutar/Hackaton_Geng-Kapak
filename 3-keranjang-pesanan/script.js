'use strict';
const TAMPILKAN_FOTO = true;
const GAMBAR_QRIS = '';

const JUMLAH_MEJA = 20;
const MAKS_PORSI = 20;
const KUNCI_MEJA = 'kapakmart-meja';
const KUNCI_RIWAYAT = 'kapakmart-riwayat';
const MAKS_RIWAYAT = 30;
const DURASI_BAYAR = 10 * 60;   
const DURASI_PROSES = 1400;     
const NOMINAL_CEPAT = [20000, 50000, 100000];
const NS_SVG = 'http://www.w3.org/2000/svg';

const VOUCHER = {
    HEMAT5: { label: 'Potongan Rp5.000', minimal: 25000, hitung: () => 5000 },
    KAPAK10: { label: 'Diskon 10% (maks. Rp10.000)', minimal: 40000, hitung: (subtotal) => Math.min(Math.round(subtotal * 0.1), 10000) },
};

const AWALAN_VA = { BCA: '39177', BRI: '26215', Mandiri: '88908', BNI: '8277' };

const buatPedas = (tingkatMaks, bawaan = 'Level 1') => ({
    id: 'pedas',
    judul: 'Level Pedas',
    tipe: 'satu',
    bawaan,
    pilihan: [
        { nama: 'Tidak Pedas', harga: 0 },
        ...Array.from({ length: tingkatMaks }, (_, i) => ({ nama: `Level ${i + 1}`, harga: 0 })),
    ],
});

const buatPilihanSatu = (id, judul, daftarNama, bawaan) => ({
    id,
    judul,
    tipe: 'satu',
    bawaan,
    pilihan: daftarNama.map((nama) => ({ nama, harga: 0 })),
});

const buatSuhu = (pilihanKedua) => buatPilihanSatu('suhu', 'Suhu', ['Es', pilihanKedua]);
const buatGula = () => buatPilihanSatu('gula', 'Tingkat Gula', ['Less Sugar', 'Normal', 'Extra Gula'], 'Normal');
const buatUkuran = () => ({
    id: 'ukuran',
    judul: 'Ukuran',
    tipe: 'satu',
    pilihan: [{ nama: 'Regular', harga: 0 }, { nama: 'Large', harga: 3000 }],
});
const buatTopping = (pilihan) => ({ id: 'topping', judul: 'Topping Tambahan', tipe: 'banyak', pilihan });

const menu = [
    {
        id: 1, nama: 'Nasi Goreng', harga: 15000, kategori: 'makanan', emoji: '🍛',
        gambar: 'gambar/nasi-goreng.jpg',
        deskripsi: 'Nasi goreng bumbu rempah dengan acar dan kerupuk.',
        opsi: [
            buatPedas(4),
            buatTopping([
                { nama: 'Telur Ceplok', harga: 4000 },
                { nama: 'Sosis', harga: 5000 },
                { nama: 'Ayam Suwir', harga: 6000 },
                { nama: 'Nasi Tambahan', harga: 4000 },
                { nama: 'Kerupuk Tambahan', harga: 2000 },
            ]),
        ],
    },
    {
        id: 2, nama: 'Mie Goreng', harga: 14000, kategori: 'makanan', emoji: '🍜',
        gambar: 'gambar/mie-goreng.jpg',
        deskripsi: 'Mie goreng gurih dengan sayuran segar.',
        opsi: [
            buatPilihanSatu('mie', 'Jenis Mie', ['Mie Kuning', 'Bihun', 'Campur']),
            buatPedas(4),
            buatTopping([
                { nama: 'Telur Ceplok', harga: 4000 },
                { nama: 'Sosis', harga: 5000 },
                { nama: 'Keju', harga: 5000 },
                { nama: 'Bakso', harga: 5000 },
            ]),
        ],
    },
    {
        id: 3, nama: 'Es Teh', harga: 4000, kategori: 'minuman', emoji: '🧋',
        gambar: 'gambar/es-teh.jpg',
        deskripsi: 'Teh manis segar, bisa dingin atau panas.',
        opsi: [
            buatSuhu('Panas'),
            buatGula(),
            buatUkuran(),
            buatTopping([
                { nama: 'Irisan Lemon', harga: 2000 },
                { nama: 'Jelly', harga: 3000 },
            ]),
        ],
    },
    {
        id: 4, nama: 'Es Jeruk', harga: 6000, kategori: 'minuman', emoji: '🍊',
        gambar: 'gambar/es-jeruk.jpg',
        deskripsi: 'Perasan jeruk segar, pas untuk cuaca panas.',
        opsi: [
            buatSuhu('Panas'),
            buatGula(),
            buatUkuran(),
            buatTopping([
                { nama: 'Jelly', harga: 3000 },
                { nama: 'Nata de Coco', harga: 3000 },
            ]),
        ],
    },
    {
        id: 5, nama: 'Ayam Geprek', harga: 16000, kategori: 'makanan', emoji: '🍗',
        gambar: 'gambar/ayam-geprek.jpg',
        deskripsi: 'Ayam krispi digeprek dengan sambal bawang.',
        opsi: [
            buatPilihanSatu('bagian', 'Bagian Ayam', ['Paha', 'Dada']),
            buatPedas(5, 'Level 2'),
            buatTopping([
                { nama: 'Keju Mozzarella', harga: 6000 },
                { nama: 'Telur Ceplok', harga: 4000 },
                { nama: 'Nasi Tambahan', harga: 4000 },
                { nama: 'Tempe Goreng', harga: 3000 },
                { nama: 'Sambal Ekstra', harga: 2000 },
            ]),
        ],
    },
    {
        id: 6, nama: 'Sate Ayam', harga: 18000, kategori: 'makanan', emoji: '🍢',
        gambar: 'gambar/sate-ayam.jpg',
        deskripsi: 'Sate ayam bakar dengan bumbu pilihan.',
        opsi: [
            buatPilihanSatu('pendamping', 'Pendamping', ['Lontong', 'Nasi Putih']),
            buatPilihanSatu('bumbu', 'Bumbu', ['Bumbu Kacang', 'Bumbu Kecap']),
            buatPedas(3, 'Tidak Pedas'),
            buatTopping([
                { nama: 'Tambah 5 Tusuk', harga: 10000 },
                { nama: 'Lontong Tambahan', harga: 3000 },
                { nama: 'Bumbu Ekstra', harga: 2000 },
            ]),
        ],
    },
    {
        id: 7, nama: 'Bakso Urat', harga: 15000, kategori: 'makanan', emoji: '🥣',
        gambar: 'gambar/bakso-urat.jpg',
        deskripsi: 'Bakso urat kenyal dengan kuah kaldu sapi.',
        opsi: [
            buatPilihanSatu('isian', 'Isian', ['Mie Kuning', 'Bihun', 'Campur']),
            buatPedas(3, 'Tidak Pedas'),
            buatTopping([
                { nama: 'Bakso Urat Tambahan', harga: 5000 },
                { nama: 'Tahu Bakso', harga: 3000 },
                { nama: 'Pangsit Goreng', harga: 4000 },
                { nama: 'Telur Rebus', harga: 4000 },
            ]),
        ],
    },
    {
        id: 8, nama: 'Nasi Ayam Katsu', harga: 20000, kategori: 'makanan', emoji: '🍱',
        gambar: 'gambar/nasi-ayam-katsu.jpg',
        deskripsi: 'Ayam katsu renyah di atas nasi hangat.',
        opsi: [
            buatPilihanSatu('saus', 'Pilihan Saus', ['Saus Katsu', 'Saus Sambal Matah', 'Saus Teriyaki']),
            buatPedas(3, 'Tidak Pedas'),
            buatTopping([
                { nama: 'Telur Ceplok', harga: 4000 },
                { nama: 'Keju Leleh', harga: 5000 },
                { nama: 'Nasi Tambahan', harga: 4000 },
                { nama: 'Saus Ekstra', harga: 2000 },
            ]),
        ],
    },
    {
        id: 9, nama: 'Jus Alpukat', harga: 12000, kategori: 'minuman', emoji: '🥑',
        gambar: 'gambar/jus-alpukat.jpg',
        deskripsi: 'Alpukat segar diblender halus dan creamy.',
        opsi: [
            buatSuhu('Tanpa Es'),
            buatGula(),
            buatUkuran(),
            buatTopping([
                { nama: 'Susu Cokelat', harga: 3000 },
                { nama: 'Susu Kental Manis', harga: 2000 },
                { nama: 'Extra Alpukat', harga: 6000 },
            ]),
        ],
    },
    {
        id: 10, nama: 'Kopi Susu Gula Aren', harga: 14000, kategori: 'minuman', emoji: '☕',
        gambar: 'gambar/kopi-susu-gula-aren.jpg',
        deskripsi: 'Kopi susu dengan gula aren yang wangi.',
        opsi: [
            buatSuhu('Panas'),
            buatGula(),
            buatUkuran(),
            buatTopping([
                { nama: 'Extra Shot', harga: 5000 },
                { nama: 'Boba', harga: 4000 },
                { nama: 'Cold Foam', harga: 4000 },
            ]),
        ],
    },
    {
        id: 11, nama: 'Indomie Goreng Telor', harga: 21000, kategori: 'makanan', emoji: '🍳',
        gambar: 'gambar/indomie-goreng-telor.jpg',
        deskripsi: 'Indomie goreng dengan telur mata sapi, sayuran, dan sambal.',
        opsi: [
            buatPilihanSatu('telur', 'Jenis Telur', ['Mata Sapi', 'Dadar', 'Setengah Matang'], 'Mata Sapi'),
            buatPedas(4),
            buatTopping([
                { nama: 'Sosis', harga: 5000 },
                { nama: 'Keju', harga: 5000 },
                { nama: 'Bakso', harga: 5000 },
                { nama: 'Kornet', harga: 6000 },
                { nama: 'Kerupuk Tambahan', harga: 2000 },
            ]),
        ],
    },
    {
        id: 12, nama: 'Es Cokelat', harga: 13000, kategori: 'minuman', emoji: '🍫',
        gambar: 'gambar/es-cokelat.jpg',
        deskripsi: 'Cokelat susu yang creamy, nikmat dingin maupun panas.',
        opsi: [
            buatSuhu('Panas'),
            buatGula(),
            buatUkuran(),
            buatTopping([
                { nama: 'Boba', harga: 4000 },
                { nama: 'Whipped Cream', harga: 4000 },
                { nama: 'Jelly', harga: 3000 },
            ]),
        ],
    },
];



const keranjang = [];
let kategoriAktif = 'semua';
let nomorMeja = null;
let produkAktif = null;   
let totalBayar = 0;       
let subtotalBayar = 0;
let diskonBayar = 0;
let voucherAktif = null;  
let versiKode = 0;        
let sisaDetik = 0;
let timerBayar = null;
let sedangProses = false;
let riwayat = [];
let urutanPesanan = 0;
let timerToast = null;
let timerSalin = null;



const ambil = (id) => document.getElementById(id);

const el = {
    tombolMeja: ambil('tombol-meja'),
    labelMeja: ambil('label-meja'),
    tombolRiwayat: ambil('tombol-riwayat'),
    jumlahRiwayat: ambil('jumlah-riwayat'),
    jumlahItem: ambil('jumlah-item'),
    filter: ambil('filter'),
    daftarMenu: ambil('daftar-menu'),
    mejaKeranjang: ambil('meja-keranjang'),
    isiKeranjang: ambil('isi-keranjang'),
    keranjangKosong: ambil('keranjang-kosong'),
    infoVoucher: ambil('info-voucher'),
    total: ambil('total'),
    tombolPesan: ambil('tombol-pesan'),
    barBawah: ambil('bar-bawah'),
    barJumlah: ambil('bar-jumlah'),
    barTotal: ambil('bar-total'),
    toast: ambil('toast'),

    dialogMeja: ambil('dialog-meja'),
    gridMeja: ambil('grid-meja'),
    tutupMeja: ambil('tutup-meja'),

    dialogProduk: ambil('dialog-produk'),
    formProduk: ambil('form-produk'),
    tutupProduk: ambil('tutup-produk'),
    produkIsi: ambil('produk-isi'),
    produkFoto: ambil('produk-foto'),
    produkMode: ambil('produk-mode'),
    produkNama: ambil('produk-nama'),
    produkHarga: ambil('produk-harga'),
    produkDeskripsi: ambil('produk-deskripsi'),
    produkOpsi: ambil('produk-opsi'),
    catatan: ambil('catatan'),
    produkStepper: ambil('produk-stepper'),
    produkKurang: ambil('produk-kurang'),
    produkTambah: ambil('produk-tambah'),
    produkJumlah: ambil('produk-jumlah'),
    produkSimpan: ambil('produk-simpan'),

    dialogBayar: ambil('dialog-bayar'),
    tutupBayar: ambil('tutup-bayar'),
    langkahBayar: ambil('langkah-bayar'),
    bayarRingkasan: ambil('bayar-ringkasan'),
    bayarMeja: ambil('bayar-meja'),
    bayarSubtotal: ambil('bayar-subtotal'),
    dtDiskon: ambil('dt-diskon'),
    bayarDiskon: ambil('bayar-diskon'),
    bayarTotal: ambil('bayar-total'),
    kodeVoucher: ambil('kode-voucher'),
    pakaiVoucher: ambil('pakai-voucher'),
    voucherInfo: ambil('voucher-info'),
    voucherCepat: ambil('voucher-cepat'),
    pilihMetode: ambil('pilih-metode'),
    timerBayar: ambil('timer-bayar'),
    timerLabel: ambil('timer-label'),
    timerWaktu: ambil('timer-waktu'),
    perbaruiKode: ambil('perbarui-kode'),
    panelQris: ambil('panel-qris'),
    qrisKotak: ambil('qris-kotak'),
    konfirmasiQris: ambil('konfirmasi-qris'),
    panelEwallet: ambil('panel-ewallet'),
    pilihEwallet: ambil('pilih-ewallet'),
    ewalletInfo: ambil('ewallet-info'),
    konfirmasiEwallet: ambil('konfirmasi-ewallet'),
    panelVa: ambil('panel-va'),
    pilihBank: ambil('pilih-bank'),
    vaNomor: ambil('va-nomor'),
    salinVa: ambil('salin-va'),
    konfirmasiVa: ambil('konfirmasi-va'),
    formTunai: ambil('form-tunai'),
    uangDiterima: ambil('uang-diterima'),
    uangCepat: ambil('uang-cepat'),
    kembalian: ambil('kembalian'),
    konfirmasiTunai: ambil('konfirmasi-tunai'),
    langkahProses: ambil('langkah-proses'),
    langkahSukses: ambil('langkah-sukses'),
    suksesNomor: ambil('sukses-nomor'),
    suksesRingkas: ambil('sukses-ringkas'),
    suksesStruk: ambil('sukses-struk'),
    suksesKembalian: ambil('sukses-kembalian'),
    suksesNilaiKembalian: ambil('sukses-nilai-kembalian'),
    suksesPesan: ambil('sukses-pesan'),
    transaksiBaru: ambil('transaksi-baru'),

    dialogRiwayat: ambil('dialog-riwayat'),
    tutupRiwayat: ambil('tutup-riwayat'),
    daftarRiwayat: ambil('daftar-riwayat'),
    riwayatKosong: ambil('riwayat-kosong'),
    hapusRiwayat: ambil('hapus-riwayat'),
};



function rupiah(angka) {
    return 'Rp' + angka.toLocaleString('id-ID');
}

function cariMenu(id) {
    return menu.find((m) => m.id === id);
}

function buatElemen(tag, { kelas, teks, atribut } = {}, ...anak) {
    const elemen = document.createElement(tag);
    if (kelas) elemen.className = kelas;
    if (teks !== undefined) elemen.textContent = teks;
    if (atribut) {
        for (const [nama, nilai] of Object.entries(atribut)) {
            elemen.setAttribute(nama, nilai);
        }
    }
    elemen.append(...anak);
    return elemen;
}

function buatSvg(tag, atribut = {}) {
    const elemen = document.createElementNS(NS_SVG, tag);
    for (const [nama, nilai] of Object.entries(atribut)) {
        elemen.setAttribute(nama, nilai);
    }
    return elemen;
}

function buatFoto(m, kelas) {
    const isi = [buatElemen('span', { teks: m.emoji, atribut: { 'aria-hidden': 'true' } })];
    if (TAMPILKAN_FOTO) {
        const gambar = buatElemen('img', { atribut: { alt: m.nama, loading: 'lazy' } });
        gambar.addEventListener('error', () => gambar.remove());
        gambar.src = m.gambar;
        isi.push(gambar);
    }
    return buatElemen('figure', { kelas }, ...isi);
}

function hargaSatuan(m, pilihan) {
    let harga = m.harga;
    for (const grup of m.opsi) {
        for (const nama of pilihan[grup.id] || []) {
            const opsi = grup.pilihan.find((p) => p.nama === nama);
            harga += opsi ? opsi.harga : 0;
        }
    }
    return harga;
}

function ringkasanPilihan(m, pilihan) {
    const bagian = [];
    for (const grup of m.opsi) {
        const dipilih = pilihan[grup.id] || [];
        if (dipilih.length === 0) continue;
        bagian.push(grup.tipe === 'banyak' ? `+ ${dipilih.join(', ')}` : dipilih[0]);
    }
    return bagian.join(' · ');
}

function rapikanPilihan(m, pilihan) {
    const rapi = {};
    for (const grup of m.opsi) {
        const dipilih = pilihan[grup.id] || [];
        rapi[grup.id] = grup.pilihan.map((p) => p.nama).filter((nama) => dipilih.includes(nama));
    }
    return rapi;
}

function hitungTotal() {
    return keranjang.reduce((jumlah, item) => {
        return jumlah + hargaSatuan(cariMenu(item.id), item.pilihan) * item.jumlah;
    }, 0);
}

function hitungJumlahItem() {
    return keranjang.reduce((jumlah, item) => jumlah + item.jumlah, 0);
}

function tampilkanToast(teks) {
    el.toast.textContent = teks;
    el.toast.hidden = false;
    clearTimeout(timerToast);
    timerToast = setTimeout(() => { el.toast.hidden = true; }, 2000);
}

function tutupSaatKlikLatar(dialog, bolehTutup = () => true) {
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog && bolehTutup()) dialog.close();
    });
}

function dataItem(item) {
    const m = cariMenu(item.id);
    return {
        id: item.id,
        nama: m.nama,
        rincian: ringkasanPilihan(m, item.pilihan),
        pilihan: item.pilihan,
        catatan: item.catatan,
        jumlah: item.jumlah,
        subtotal: hargaSatuan(m, item.pilihan) * item.jumlah,
    };
}

function buatBarisRincian(d) {
    const kiri = buatElemen('div', {}, buatElemen('strong', { teks: `${d.jumlah}× ${d.nama}` }));
    if (d.rincian) kiri.append(buatElemen('small', { teks: d.rincian }));
    if (d.catatan) kiri.append(buatElemen('small', { teks: `Catatan: ${d.catatan}` }));
    return buatElemen('li', {}, kiri, buatElemen('span', { teks: rupiah(d.subtotal) }));
}



function buatKartuMenu(m) {
    return buatElemen('article', { kelas: 'kartu kartu-menu', atribut: { 'data-id': m.id } },
        buatFoto(m, 'foto'),
        buatElemen('div', { kelas: 'info' },
            buatElemen('h3', { teks: m.nama }),
            buatElemen('p', { kelas: 'deskripsi', teks: m.deskripsi }),
            buatElemen('p', { kelas: 'harga', teks: rupiah(m.harga) }),
            buatElemen('button', { teks: 'Pilih', atribut: { type: 'button', 'aria-label': `Pilih ${m.nama}` } }),
        ),
    );
}

function tampilkanMenu() {
    const tampil = menu.filter((m) => kategoriAktif === 'semua' || m.kategori === kategoriAktif);
    el.daftarMenu.replaceChildren(...tampil.map(buatKartuMenu));
}



function bacaMejaTersimpan() {
    try {
        const nomor = Number(sessionStorage.getItem(KUNCI_MEJA));
        return nomor >= 1 && nomor <= JUMLAH_MEJA ? nomor : null;
    } catch {
        return null;
    }
}

function simpanMeja(nomor) {
    try {
        sessionStorage.setItem(KUNCI_MEJA, String(nomor));
    } catch {
    }
}

function hapusMeja() {
    try {
        sessionStorage.removeItem(KUNCI_MEJA);
    } catch {
    }
}

function perbaruiLabelMeja() {
    const label = nomorMeja === null ? 'Pilih meja' : `Meja ${nomorMeja}`;
    el.labelMeja.textContent = label;
    el.mejaKeranjang.textContent = nomorMeja === null ? 'Belum pilih meja' : label;
}

function tampilkanGridMeja() {
    const tombol = [];
    for (let nomor = 1; nomor <= JUMLAH_MEJA; nomor++) {
        const aktif = nomor === nomorMeja;
        tombol.push(buatElemen('button', {
            kelas: aktif ? 'aktif' : '',
            teks: String(nomor),
            atribut: { type: 'button', 'data-nomor': nomor, 'aria-pressed': String(aktif) },
        }));
    }
    el.gridMeja.replaceChildren(...tombol);
}

function bukaDialogMeja() {
    tampilkanGridMeja();
    el.tutupMeja.hidden = nomorMeja === null;  
    if (!el.dialogMeja.open) el.dialogMeja.showModal();
}

function pilihMeja(nomor) {
    nomorMeja = nomor;
    simpanMeja(nomor);
    perbaruiLabelMeja();
    el.dialogMeja.close();
    tampilkanToast(`Pesanan akan diantar ke Meja ${nomor}`);
}



function buatPilihanOpsi(grup, p, terpilih) {
    const input = buatElemen('input', {
        atribut: {
            type: grup.tipe === 'satu' ? 'radio' : 'checkbox',
            name: `opsi-${grup.id}`,
            value: p.nama,
            'data-grup': grup.id,
        },
    });
    input.checked = terpilih.includes(p.nama);

    const tambahan = p.harga > 0 ? `+${rupiah(p.harga)}` : '';

    if (grup.tipe === 'satu') {
        const tulisan = buatElemen('span', {}, p.nama);
        if (tambahan) tulisan.append(buatElemen('small', { teks: tambahan }));
        return buatElemen('label', { kelas: 'pilihan-chip' }, input, tulisan);
    }
    return buatElemen('label', { kelas: 'baris-topping' },
        input,
        buatElemen('span', { teks: p.nama }),
        buatElemen('span', { kelas: 'harga-opsi', teks: tambahan }),
    );
}

function buatGrupOpsi(grup, terpilih) {
    const keterangan = grup.tipe === 'satu' ? 'Pilih 1' : 'Boleh lebih dari 1';
    return buatElemen('fieldset', { kelas: `grup-${grup.tipe}` },
        buatElemen('legend', {},
            buatElemen('span', { teks: grup.judul }),
            buatElemen('small', { kelas: 'label-opsi', teks: keterangan }),
        ),
        ...grup.pilihan.map((p) => buatPilihanOpsi(grup, p, terpilih)),
    );
}

function bukaProduk(m, itemUbah = null) {
    produkAktif = {
        menu: m,
        pilihan: {},
        jumlah: itemUbah ? itemUbah.jumlah : 1,
        kunciUbah: itemUbah ? itemUbah.key : null,
    };
    for (const grup of m.opsi) {
        if (itemUbah) {
            produkAktif.pilihan[grup.id] = [...(itemUbah.pilihan[grup.id] || [])];
        } else {
            produkAktif.pilihan[grup.id] = grup.tipe === 'satu' ? [grup.bawaan || grup.pilihan[0].nama] : [];
        }
    }

    el.produkFoto.replaceChildren(buatFoto(m, 'foto foto-besar'));
    el.produkMode.hidden = !itemUbah;
    el.produkNama.textContent = m.nama;
    el.produkHarga.textContent = `Mulai ${rupiah(m.harga)}`;
    el.produkDeskripsi.textContent = m.deskripsi;
    el.produkOpsi.replaceChildren(...m.opsi.map((grup) => buatGrupOpsi(grup, produkAktif.pilihan[grup.id])));
    el.catatan.value = itemUbah ? itemUbah.catatan : '';
    el.produkIsi.scrollTop = 0;
    perbaruiTombolProduk();
    el.dialogProduk.showModal();
}

function perbaruiTombolProduk() {
    const subtotal = hargaSatuan(produkAktif.menu, produkAktif.pilihan) * produkAktif.jumlah;
    const aksi = produkAktif.kunciUbah ? 'Simpan' : 'Tambah';
    el.produkJumlah.textContent = String(produkAktif.jumlah);
    el.produkSimpan.textContent = `${aksi} · ${rupiah(subtotal)}`;
    el.produkKurang.disabled = produkAktif.jumlah <= 1;
    el.produkTambah.disabled = produkAktif.jumlah >= MAKS_PORSI;
}

function ubahPilihanProduk(input) {
    const idGrup = input.dataset.grup;
    if (!idGrup || !produkAktif) return;

    if (input.type === 'radio') {
        produkAktif.pilihan[idGrup] = [input.value];
    } else if (input.checked) {
        produkAktif.pilihan[idGrup].push(input.value);
    } else {
        produkAktif.pilihan[idGrup] = produkAktif.pilihan[idGrup].filter((nama) => nama !== input.value);
    }
    perbaruiTombolProduk();
}

function buatKunci(m, pilihanRapi, catatan) {
    return [m.id, JSON.stringify(pilihanRapi), catatan].join('|');
}

function masukkanItem(m, pilihan, catatan, jumlah) {
    const pilihanRapi = rapikanPilihan(m, pilihan);
    const key = buatKunci(m, pilihanRapi, catatan);
    const sudahAda = keranjang.find((item) => item.key === key);
    if (sudahAda) {
        sudahAda.jumlah = Math.min(sudahAda.jumlah + jumlah, MAKS_PORSI);
    } else {
        keranjang.push({ key, id: m.id, pilihan: pilihanRapi, catatan, jumlah: Math.min(jumlah, MAKS_PORSI) });
    }
}

function tambahKeKeranjang() {
    const { menu: m, pilihan, jumlah, kunciUbah } = produkAktif;
    const catatan = el.catatan.value.trim();

    if (kunciUbah) {
        const indeks = keranjang.findIndex((item) => item.key === kunciUbah);
        if (indeks !== -1) {
            const pilihanRapi = rapikanPilihan(m, pilihan);
            const key = buatKunci(m, pilihanRapi, catatan);
            const kembar = keranjang.findIndex((item, i) => i !== indeks && item.key === key);
            if (kembar !== -1) {
                keranjang[kembar].jumlah = Math.min(keranjang[kembar].jumlah + jumlah, MAKS_PORSI);
                keranjang.splice(indeks, 1);
            } else {
                keranjang[indeks] = { key, id: m.id, pilihan: pilihanRapi, catatan, jumlah };
            }
            el.dialogProduk.close();
            tampilkanKeranjang();
            tampilkanToast(`${m.nama} diperbarui`);
            return;
        }
    }

    masukkanItem(m, pilihan, catatan, jumlah);
    el.dialogProduk.close();
    tampilkanKeranjang();
    tampilkanToast(`${m.nama} ditambahkan`);
}



function buatBarisKeranjang(item) {
    const m = cariMenu(item.id);
    const satuan = hargaSatuan(m, item.pilihan);
    const rincian = ringkasanPilihan(m, item.pilihan);

    const detail = buatElemen('div', { kelas: 'detail-item' }, buatElemen('strong', { teks: m.nama }));
    if (rincian) detail.append(buatElemen('small', { teks: rincian }));
    if (item.catatan) detail.append(buatElemen('small', { teks: `Catatan: ${item.catatan}` }));
    detail.append(buatElemen('div', { kelas: 'baris-harga' },
        buatElemen('span', { kelas: 'harga-item', teks: rupiah(satuan * item.jumlah) }),
        buatElemen('button', { kelas: 'tombol-ubah', teks: 'Ubah', atribut: { type: 'button', 'data-aksi': 'ubah', 'aria-label': `Ubah pesanan ${m.nama}` } }),
    ));

    const stepper = buatElemen('div', { kelas: 'stepper stepper-kecil', atribut: { role: 'group', 'aria-label': `Jumlah ${m.nama}` } },
        buatElemen('button', { teks: '−', atribut: { type: 'button', 'data-aksi': 'kurang', 'aria-label': `Kurangi ${m.nama}` } }),
        buatElemen('span', { teks: String(item.jumlah) }),
        buatElemen('button', { teks: '+', atribut: { type: 'button', 'data-aksi': 'tambah', 'aria-label': `Tambah ${m.nama}` } }),
    );

    return buatElemen('li', { atribut: { 'data-key': item.key } }, detail, stepper);
}

function perbaruiInfoVoucher(total) {
    const daftar = Object.entries(VOUCHER).sort((a, b) => a[1].minimal - b[1].minimal);
    const tercapai = daftar.filter(([, v]) => total >= v.minimal);
    const berikutnya = daftar.find(([, v]) => total < v.minimal);
    const bagian = [];
    if (tercapai.length > 0) bagian.push(`Voucher ${tercapai.map(([kode]) => kode).join(', ')} bisa dipakai saat bayar.`);
    if (berikutnya) bagian.push(`Tambah ${rupiah(berikutnya[1].minimal - total)} lagi untuk voucher ${berikutnya[0]}.`);
    el.infoVoucher.textContent = bagian.join(' ');
    el.infoVoucher.hidden = total === 0 || bagian.length === 0;
}

function tampilkanKeranjang() {
    const total = hitungTotal();
    const jumlah = hitungJumlahItem();

    el.isiKeranjang.replaceChildren(...keranjang.map(buatBarisKeranjang));
    el.total.textContent = rupiah(total);
    el.jumlahItem.textContent = String(jumlah);
    el.keranjangKosong.hidden = keranjang.length > 0;
    el.tombolPesan.disabled = keranjang.length === 0;
    el.barBawah.hidden = keranjang.length === 0;
    el.barJumlah.textContent = String(jumlah);
    el.barTotal.textContent = rupiah(total);
    perbaruiInfoVoucher(total);
}

function ubahJumlahItem(key, perubahan) {
    const indeks = keranjang.findIndex((item) => item.key === key);
    if (indeks === -1) return;

    keranjang[indeks].jumlah = Math.min(keranjang[indeks].jumlah + perubahan, MAKS_PORSI);
    if (keranjang[indeks].jumlah <= 0) keranjang.splice(indeks, 1);
    tampilkanKeranjang();
}



function bacaRiwayat() {
    try {
        const data = JSON.parse(localStorage.getItem(KUNCI_RIWAYAT));
        return Array.isArray(data) ? data.filter((p) => p && Array.isArray(p.item)) : [];
    } catch {
        return [];
    }
}

function simpanRiwayat() {
    try {
        localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(riwayat));
    } catch {
    }
}

function perbaruiJumlahRiwayat() {
    el.jumlahRiwayat.textContent = String(riwayat.length);
}

function catatRiwayat(nomor, metode, diterima, kembalian) {
    riwayat.unshift({
        urut: urutanPesanan,
        nomor,
        meja: nomorMeja,
        waktu: Date.now(),
        metode,
        voucher: voucherAktif,
        subtotal: subtotalBayar,
        diskon: diskonBayar,
        total: totalBayar,
        diterima,
        kembalian,
        item: keranjang.map(dataItem),
    });
    riwayat.length = Math.min(riwayat.length, MAKS_RIWAYAT);
    simpanRiwayat();
    perbaruiJumlahRiwayat();
}

function buatKartuRiwayat(p) {
    const waktu = new Date(p.waktu).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const kepala = buatElemen('div', { kelas: 'riwayat-kepala' },
        buatElemen('div', {},
            buatElemen('strong', { teks: `#${p.nomor}` }),
            buatElemen('small', { teks: `${waktu} · Meja ${p.meja} · ${p.metode}` }),
        ),
        buatElemen('strong', { kelas: 'riwayat-total', teks: rupiah(p.total) }),
    );
    const rincian = buatElemen('ul', { kelas: 'rincian' }, ...p.item.map(buatBarisRincian));
    if (p.diskon > 0) {
        rincian.append(buatElemen('li', { kelas: 'baris-diskon' },
            buatElemen('span', { teks: `Voucher ${p.voucher}` }),
            buatElemen('span', { teks: `-${rupiah(p.diskon)}` }),
        ));
    }
    const ulang = buatElemen('button', { kelas: 'sekunder', teks: 'Pesan Lagi', atribut: { type: 'button', 'data-urut': p.urut, 'aria-label': `Pesan lagi seperti pesanan ${p.nomor}` } });
    return buatElemen('li', { kelas: 'kartu riwayat-item' }, kepala, rincian, ulang);
}

function tampilkanRiwayat() {
    el.daftarRiwayat.replaceChildren(...riwayat.map(buatKartuRiwayat));
    el.riwayatKosong.hidden = riwayat.length > 0;
    el.hapusRiwayat.hidden = riwayat.length === 0;
}

function bukaDialogRiwayat() {
    tampilkanRiwayat();
    el.dialogRiwayat.showModal();
}

function pesanUlang(p) {
    let berhasil = 0;
    for (const i of p.item) {
        const m = cariMenu(i.id);
        if (!m) continue;
        masukkanItem(m, i.pilihan || {}, i.catatan || '', i.jumlah);
        berhasil += 1;
    }
    el.dialogRiwayat.close();
    tampilkanKeranjang();
    tampilkanToast(berhasil > 0 ? `Pesanan #${p.nomor} masuk ke keranjang` : 'Menu pada pesanan ini sudah tidak tersedia');
}


function buatQrDemo(benih) {
    const ukuran = 25;
    let status = benih || 1;
    const acak = () => {
        status = (status + 0x6d2b79f5) | 0;
        let t = Math.imul(status ^ (status >>> 15), 1 | status);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const diPojok = (baris, kolom) => {
        return (baris < 8 && kolom < 8) || (baris < 8 && kolom >= ukuran - 8) || (baris >= ukuran - 8 && kolom < 8);
    };

    const svg = buatSvg('svg', {
        viewBox: `0 0 ${ukuran} ${ukuran}`,
        'shape-rendering': 'crispEdges',
        role: 'img',
        'aria-label': 'Contoh kode QRIS untuk demo',
    });

    for (let baris = 0; baris < ukuran; baris++) {
        for (let kolom = 0; kolom < ukuran; kolom++) {
            if (!diPojok(baris, kolom) && acak() > 0.5) {
                svg.append(buatSvg('rect', { x: kolom, y: baris, width: 1, height: 1 }));
            }
        }
    }

    const tambahPenanda = (x, y) => {
        svg.append(
            buatSvg('rect', { x, y, width: 7, height: 7 }),
            buatSvg('rect', { x: x + 1, y: y + 1, width: 5, height: 5, fill: '#ffffff' }),
            buatSvg('rect', { x: x + 2, y: y + 2, width: 3, height: 3 }),
        );
    };
    tambahPenanda(0, 0);
    tambahPenanda(ukuran - 7, 0);
    tambahPenanda(0, ukuran - 7);
    return svg;
}

function tampilkanQris() {
    if (GAMBAR_QRIS) {
        el.qrisKotak.replaceChildren(buatElemen('img', { atribut: { src: GAMBAR_QRIS, alt: 'Kode QRIS Kapak Mart' } }));
    } else {
        el.qrisKotak.replaceChildren(buatQrDemo(totalBayar + versiKode * 977), buatElemen('span', { kelas: 'label-demo', teks: 'QRIS Demo' }));
    }
}


function hitungDiskon(subtotal) {
    if (!voucherAktif) return 0;
    const v = VOUCHER[voucherAktif];
    return subtotal >= v.minimal ? Math.min(v.hitung(subtotal), subtotal) : 0;
}

function aturInfoVoucher(teks, status = '') {
    el.voucherInfo.textContent = teks;
    el.voucherInfo.className = `redup voucher-info ${status}`.trim();
}

function pakaiVoucher(kodeMasukan) {
    const kode = kodeMasukan.trim().toUpperCase();
    const v = VOUCHER[kode];

    if (kode === '') {
        if (voucherAktif) aturInfoVoucher('Voucher dilepas.');
        else aturInfoVoucher('Masukkan kode voucher dulu.', 'galat');
        voucherAktif = null;
    } else if (!v) {
        voucherAktif = null;
        aturInfoVoucher('Kode voucher tidak ditemukan.', 'galat');
    } else if (subtotalBayar < v.minimal) {
        voucherAktif = null;
        aturInfoVoucher(`Voucher ${kode} berlaku untuk belanja minimal ${rupiah(v.minimal)}.`, 'galat');
    } else {
        voucherAktif = kode;
        el.kodeVoucher.value = kode;
        aturInfoVoucher(`Voucher ${kode} dipakai: ${v.label}.`, 'ok');
    }
    terapkanTotal();
}

function buatChipVoucher() {
    const tombol = Object.entries(VOUCHER).map(([kode, v]) => buatElemen('button', {
        teks: `${kode} · min. ${rupiah(v.minimal)}`,
        atribut: { type: 'button', 'data-kode': kode, title: v.label },
    }));
    el.voucherCepat.replaceChildren(...tombol);
}

function terapkanTotal() {
    diskonBayar = hitungDiskon(subtotalBayar);
    totalBayar = subtotalBayar - diskonBayar;

    el.bayarSubtotal.textContent = rupiah(subtotalBayar);
    el.dtDiskon.hidden = el.bayarDiskon.hidden = diskonBayar === 0;
    el.bayarDiskon.textContent = `-${rupiah(diskonBayar)}`;
    el.bayarTotal.textContent = rupiah(totalBayar);

    tampilkanQris();
    perbaruiEwallet();
    perbaruiVa();
    buatTombolCepat();
    perbaruiKembalian();
}


function formatWaktu(detik) {
    const menit = Math.floor(detik / 60);
    return `${String(menit).padStart(2, '0')}:${String(detik % 60).padStart(2, '0')}`;
}

function hentikanTimer() {
    clearInterval(timerBayar);
    timerBayar = null;
}

function aturKedaluwarsa(habis) {
    el.timerBayar.classList.toggle('habis', habis);
    el.perbaruiKode.hidden = !habis;
    el.timerLabel.textContent = habis ? 'Kode pembayaran kedaluwarsa' : 'Selesaikan pembayaran dalam';
    for (const tombol of [el.konfirmasiQris, el.konfirmasiEwallet, el.konfirmasiVa]) {
        tombol.disabled = habis;
    }
}

function mulaiTimer() {
    hentikanTimer();
    sisaDetik = DURASI_BAYAR;
    el.timerWaktu.textContent = formatWaktu(sisaDetik);
    aturKedaluwarsa(false);
    timerBayar = setInterval(() => {
        sisaDetik -= 1;
        el.timerWaktu.textContent = formatWaktu(Math.max(sisaDetik, 0));
        if (sisaDetik <= 0) {
            hentikanTimer();
            aturKedaluwarsa(true);
        }
    }, 1000);
}


function perbaruiEwallet() {
    const nama = el.pilihEwallet.querySelector('input:checked').value;
    el.ewalletInfo.textContent = `Buka aplikasi ${nama}, lalu setujui tagihan ${rupiah(totalBayar)} dari Kapak Mart. Ini hanya simulasi untuk demo.`;
}

function nomorVa() {
    const bank = el.pilihBank.querySelector('input:checked').value;
    const dasar = ((nomorMeja || 0) * 7919 + urutanPesanan + 1) * 104729 + totalBayar + versiKode * 7777;
    return AWALAN_VA[bank] + String(dasar % 100000000000).padStart(11, '0');
}

function perbaruiVa() {
    const nomor = nomorVa();
    el.vaNomor.textContent = nomor.replace(/(.{4})/g, '$1 ').trim();
    el.vaNomor.dataset.nilai = nomor;
}

async function salinVa() {
    let pesan = 'Tersalin ✓';
    try {
        await navigator.clipboard.writeText(el.vaNomor.dataset.nilai);
    } catch {
        pesan = 'Salin manual ya';
    }
    el.salinVa.textContent = pesan;
    clearTimeout(timerSalin);
    timerSalin = setTimeout(() => { el.salinVa.textContent = 'Salin Nomor'; }, 1600);
}


function tampilkanMetode(metode) {
    el.panelQris.hidden = metode !== 'qris';
    el.panelEwallet.hidden = metode !== 'ewallet';
    el.panelVa.hidden = metode !== 'va';
    el.formTunai.hidden = metode !== 'tunai';
    el.timerBayar.hidden = metode === 'tunai';
    if (metode === 'tunai') el.uangDiterima.focus();
}

function buatTombolCepat() {
    const daftar = [...new Set([totalBayar, ...NOMINAL_CEPAT])].filter((nominal) => nominal >= totalBayar);
    const tombol = daftar.map((nominal) => buatElemen('button', {
        teks: nominal === totalBayar ? 'Uang Pas' : rupiah(nominal),
        atribut: { type: 'button', 'data-nilai': nominal },
    }));
    el.uangCepat.replaceChildren(...tombol);
}

function perbaruiKembalian() {
    const diterima = Number(el.uangDiterima.value) || 0;
    const selisih = diterima - totalBayar;

    if (diterima === 0) {
        el.kembalian.textContent = rupiah(0);
    } else if (selisih < 0) {
        el.kembalian.textContent = `Kurang ${rupiah(-selisih)}`;
    } else {
        el.kembalian.textContent = rupiah(selisih);
    }
    el.kembalian.classList.toggle('kurang', diterima > 0 && selisih < 0);
    el.konfirmasiTunai.disabled = diterima === 0 || selisih < 0;
}


function bukaDialogBayar() {
    if (keranjang.length === 0) return;
    if (nomorMeja === null) {
        bukaDialogMeja();
        return;
    }

    subtotalBayar = hitungTotal();
    voucherAktif = null;
    versiKode = 0;
    el.bayarRingkasan.replaceChildren(...keranjang.map((item) => buatBarisRincian(dataItem(item))));
    el.bayarMeja.textContent = `Meja ${nomorMeja}`;
    el.kodeVoucher.value = '';
    aturInfoVoucher('');
    el.uangDiterima.value = '';
    el.salinVa.textContent = 'Salin Nomor';
    el.pilihMetode.querySelector('input[value="qris"]').checked = true;
    el.tutupBayar.hidden = false;
    el.langkahBayar.hidden = false;
    el.langkahProses.hidden = true;
    el.langkahSukses.hidden = true;

    terapkanTotal();
    mulaiTimer();
    tampilkanMetode('qris');
    el.dialogBayar.showModal();
}

function prosesBayar(metode, ringkas, kembalian = null, diterima = null) {
    if (sedangProses) return;
    sedangProses = true;
    hentikanTimer();
    el.tutupBayar.hidden = true;
    el.langkahBayar.hidden = true;
    el.langkahProses.hidden = false;

    setTimeout(() => {
        sedangProses = false;
        el.tutupBayar.hidden = false;
        el.langkahProses.hidden = true;
        tampilkanSukses(metode, ringkas, kembalian, diterima);
    }, DURASI_PROSES);
}

function tampilkanSukses(metode, ringkas, kembalian = null, diterima = null) {
    urutanPesanan += 1;
    const nomor = `A${String(urutanPesanan).padStart(3, '0')}`;
    catatRiwayat(nomor, metode, diterima, kembalian);

    el.suksesNomor.textContent = nomor;
    el.suksesRingkas.textContent = diskonBayar > 0 ? `${ringkas} · Hemat ${rupiah(diskonBayar)}` : ringkas;
    el.suksesStruk.replaceChildren(...riwayat[0].item.map(buatBarisRincian));
    el.suksesKembalian.hidden = kembalian === null;
    if (kembalian !== null) el.suksesNilaiKembalian.textContent = rupiah(kembalian);
    el.suksesPesan.textContent = `Pesananmu akan diantar ke Meja ${nomorMeja}. Mohon ditunggu ya.`;
    el.langkahBayar.hidden = true;
    el.langkahSukses.hidden = false;
}

function selesaiTransaksi() {
    keranjang.length = 0;
    voucherAktif = null;
    tampilkanKeranjang();
    nomorMeja = null;
    hapusMeja();
    perbaruiLabelMeja();
    tampilkanToast('Klik "Pilih meja" untuk pesanan berikutnya');
}


el.daftarMenu.addEventListener('click', (e) => {
    const kartu = e.target.closest('[data-id]');
    if (kartu) bukaProduk(cariMenu(Number(kartu.dataset.id)));
});

el.filter.addEventListener('click', (e) => {
    const tombol = e.target.closest('button[data-kategori]');
    if (!tombol) return;

    kategoriAktif = tombol.dataset.kategori;
    for (const b of el.filter.querySelectorAll('button')) {
        const aktif = b === tombol;
        b.classList.toggle('aktif', aktif);
        b.setAttribute('aria-pressed', String(aktif));
    }
    tampilkanMenu();
});

el.isiKeranjang.addEventListener('click', (e) => {
    const tombol = e.target.closest('button[data-aksi]');
    if (!tombol) return;
    const key = tombol.closest('li').dataset.key;

    if (tombol.dataset.aksi === 'ubah') {
        const item = keranjang.find((i) => i.key === key);
        if (item) bukaProduk(cariMenu(item.id), item);
        return;
    }
    ubahJumlahItem(key, tombol.dataset.aksi === 'tambah' ? 1 : -1);
});

el.tombolMeja.addEventListener('click', bukaDialogMeja);
el.tutupMeja.addEventListener('click', () => el.dialogMeja.close());
el.gridMeja.addEventListener('click', (e) => {
    const tombol = e.target.closest('button[data-nomor]');
    if (tombol) pilihMeja(Number(tombol.dataset.nomor));
});
el.dialogMeja.addEventListener('cancel', (e) => {
    if (nomorMeja === null) e.preventDefault();
});
tutupSaatKlikLatar(el.dialogMeja, () => nomorMeja !== null);

el.tutupProduk.addEventListener('click', () => el.dialogProduk.close());
tutupSaatKlikLatar(el.dialogProduk);
el.produkOpsi.addEventListener('change', (e) => ubahPilihanProduk(e.target));
el.produkStepper.addEventListener('click', (e) => {
    const tombol = e.target.closest('button[data-aksi]');
    if (!tombol || !produkAktif) return;
    const perubahan = tombol.dataset.aksi === 'tambah' ? 1 : -1;
    produkAktif.jumlah = Math.min(Math.max(produkAktif.jumlah + perubahan, 1), MAKS_PORSI);
    perbaruiTombolProduk();
});
el.formProduk.addEventListener('submit', (e) => {
    e.preventDefault();
    tambahKeKeranjang();
});

el.tombolPesan.addEventListener('click', bukaDialogBayar);
el.tutupBayar.addEventListener('click', () => el.dialogBayar.close());
tutupSaatKlikLatar(el.dialogBayar, () => !sedangProses);
el.dialogBayar.addEventListener('cancel', (e) => {
    if (sedangProses) e.preventDefault();
});
el.dialogBayar.addEventListener('close', () => {
    hentikanTimer();
    if (!el.langkahSukses.hidden) selesaiTransaksi();
});
el.pilihMetode.addEventListener('change', (e) => tampilkanMetode(e.target.value));
el.pilihEwallet.addEventListener('change', perbaruiEwallet);
el.pilihBank.addEventListener('change', perbaruiVa);
el.perbaruiKode.addEventListener('click', () => {
    versiKode += 1;
    terapkanTotal();
    mulaiTimer();
});
el.salinVa.addEventListener('click', salinVa);

el.pakaiVoucher.addEventListener('click', () => pakaiVoucher(el.kodeVoucher.value));
el.kodeVoucher.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        pakaiVoucher(el.kodeVoucher.value);
    }
});
el.voucherCepat.addEventListener('click', (e) => {
    const tombol = e.target.closest('button[data-kode]');
    if (tombol) pakaiVoucher(tombol.dataset.kode);
});

el.konfirmasiQris.addEventListener('click', () => {
    prosesBayar('QRIS', `Dibayar dengan QRIS · ${rupiah(totalBayar)}`);
});
el.konfirmasiEwallet.addEventListener('click', () => {
    const nama = el.pilihEwallet.querySelector('input:checked').value;
    prosesBayar(nama, `Dibayar dengan ${nama} · ${rupiah(totalBayar)}`);
});
el.konfirmasiVa.addEventListener('click', () => {
    const bank = el.pilihBank.querySelector('input:checked').value;
    prosesBayar(`Transfer ${bank}`, `Transfer ${bank} · ${rupiah(totalBayar)}`);
});
el.uangDiterima.addEventListener('input', perbaruiKembalian);
el.uangCepat.addEventListener('click', (e) => {
    const tombol = e.target.closest('button[data-nilai]');
    if (!tombol) return;
    el.uangDiterima.value = tombol.dataset.nilai;
    perbaruiKembalian();
});
el.formTunai.addEventListener('submit', (e) => {
    e.preventDefault();
    const diterima = Number(el.uangDiterima.value) || 0;
    if (diterima < totalBayar) return;
    prosesBayar('Tunai', `Total ${rupiah(totalBayar)} · Tunai ${rupiah(diterima)}`, diterima - totalBayar, diterima);
});
el.transaksiBaru.addEventListener('click', () => el.dialogBayar.close());

el.tombolRiwayat.addEventListener('click', bukaDialogRiwayat);
el.tutupRiwayat.addEventListener('click', () => el.dialogRiwayat.close());
tutupSaatKlikLatar(el.dialogRiwayat);
el.daftarRiwayat.addEventListener('click', (e) => {
    const tombol = e.target.closest('button[data-urut]');
    if (!tombol) return;
    const pesanan = riwayat.find((p) => p.urut === Number(tombol.dataset.urut));
    if (pesanan) pesanUlang(pesanan);
});
el.hapusRiwayat.addEventListener('click', () => {
    if (!confirm('Hapus semua riwayat pesanan?')) return;
    riwayat = [];
    simpanRiwayat();
    perbaruiJumlahRiwayat();
    tampilkanRiwayat();
});

function inisialisasi() {
    riwayat = bacaRiwayat();
    urutanPesanan = riwayat.reduce((maks, p) => Math.max(maks, Number(p.urut) || 0), 0);
    nomorMeja = bacaMejaTersimpan();
    perbaruiLabelMeja();
    perbaruiJumlahRiwayat();
    buatChipVoucher();
    tampilkanMenu();
    tampilkanKeranjang();
    if (nomorMeja === null) bukaDialogMeja(); 
}

inisialisasi();