// Data sementara. Nanti diganti dengan services/ saat API sudah jadi.
export const resellerRegions = [
    {
        name: 'Jawa Tengah',
        cities: [
            {
                name: 'Salatiga', branches: [
                    { address: 'Jl. Imam Bonjol No.28', phones: ['(0298) 326431'] },
                    { address: 'Jl. Merbabu No.42 Salatiga', phones: [] },
                ]
            },
            { name: 'Ungaran', branches: [{ address: 'Jl. S. Parman No.87 Pundung Putih', phones: ['(024) 6923384'] }] },
            { name: 'Semarang', branches: [{ address: 'Jl. Citra Grand Cluster Riverside A21, Sambiroto, Semarang', phones: [] }] },
            {
                name: 'Kendal', branches: [
                    { address: 'Jl. Soekarno Hatta No.167', phones: ['(0294) 5750802'] },
                    { address: 'Jl. Tentara Pelajar, Kendal', phones: ['(0294) 5705798'] },
                ]
            },
            {
                name: 'Pekalongan', branches: [
                    { address: 'Jl. Karya Bhakti No 9 Medono Pekalongan', phones: ['(0285) 7970900'] },
                    { address: 'Jl. Angkatan 45 No. 26 Pekalongan', phones: ['(0285) 410242'] },
                ]
            },
            { name: 'Boyolali', branches: [{ address: 'Jl. Boyolali-Klaten Km.2, Selatan Masjid Ageng Alun Alun Boyolali', phones: ['087835013370'] }] },
            { name: 'Klaten', branches: [{ address: 'Jl. Ki Ageng Gribig Km.2,2', phones: ['(0272) 3140601'] }] },
            {
                name: 'Magelang', branches: [
                    { address: 'Jl. Sarwo Edi Wibowo, Pakelan', phones: ['(0293) 5501533'] },
                    { address: 'Jl. Tidar No. 24 Magelang', phones: ['(0293) 363453'] },
                ]
            },
            { name: 'Wonosobo', branches: [{ address: 'Jl. Dieng Km.0 Ruko Visara Building Lonkrang Wonosobo', phones: ['(0286) 5806070'] }] },
            { name: 'Kebumen', branches: [{ address: 'Jl. Sarbini No.63', phones: ['(0287) 5563312'] }] },
            { name: 'Pati', branches: [{ address: 'Jl. Kol. Sunandar No.54B', phones: ['(0285) 5507444'] }] },
            {
                name: 'Rembang', branches: [
                    { address: 'Jl. Dr. Sutomo No.59', phones: ['(0295) 5506234'] },
                    { address: 'Jl. Jatirogo No. 11 Lasem', phones: ['(0295) 531050'] },
                ]
            },
            { name: 'Sukoharjo', branches: [{ address: 'Jl. Moewardi No. 28C Sukoharjo', phones: ['(0271) 2240063'] }] },
            { name: 'Karanganyar', branches: [{ address: 'Jl. Lawu No.32, Karanganyar', phones: ['(0271) 5888318'] }] },
            { name: 'Ambarawa', branches: [{ address: 'Jl. Jend Sudirman I | 5 Ambarawa', phones: ['(0298) 594464'] }] },
            { name: 'Banyumas', branches: [{ address: 'Kios Perum Griya Sokaraja Permai No. 10 Sokaraja, Banyumas', phones: ['(0281) 6441396'] }] },
            { name: 'Cilacap', branches: [{ address: 'Jl. Sulawesi, Perum Tanjung Intan Ruko B3', phones: ['(0282) 5520708'] }] },
            { name: 'Surakarta', branches: [{ address: 'Jl. Ir. Sutami No. 96 A Jebres, Surakarta', phones: ['(0271) 643886'] }] },
            { name: 'Banjarnegara', branches: [{ address: 'Ruko Atrium Square Blok D No. 13, Jl. DI Panjaitan Banjarnegara', phones: ['(0286) 593005'] }] },
            { name: 'Tegal', branches: [{ address: 'Jl. Teuku Umar No. 115 Tegal', phones: ['0852 2546 1720'] }] },
            { name: 'Cepu', branches: [{ address: 'Jl. Blora No 94 Wonorejo Cepu Blora', phones: ['081 329 721 229', '081 335 818 989'] }] },
        ],
    },
    {
        name: 'Jawa Timur',
        cities: [
            { name: 'Bojonegoro', branches: [{ address: 'Ruko Gajah Mada Blok G-1, Jln Gajah Mada Bojonegoro', phones: ['0353-7750992', '081329162703'] }] },
            { name: 'Surabaya', branches: [{ address: 'Jl. Krukah Tengah No. 58 Surabaya', phones: ['0888 3224 442', '08971825507'] }] },
            { name: 'Kediri', branches: [{ address: 'Jl. Letjen Suparman No. 112 B Tosaren Kediri', phones: ['082260370371'] }] },
            { name: 'Banyuwangi', branches: [{ address: 'Jl. Brigjend. Katamso No.21 Banyuwangi', phones: ['0823 3480 5527'] }] },
        ],
    },
    {
        name: 'Jawa Barat',
        cities: [
            { name: 'Cirebon', branches: [{ address: 'Jl. Panjunan No.60 Cirebon', phones: ['0888 0652 0481'] }] },
            {
                name: 'Bandung', branches: [
                    { address: 'City Garden Residence, Jl. Abdul Hamid No.14, Jatihandap, Mandalajati, Kota Bandung 40195', phones: [] },
                    { address: 'Jl. Ibrahim Adjie No. 47, Bandung Trade Mall, BTM Lt 2 DD 17-19 (Fortech)', phones: ['022-20525886'] },
                    { address: 'Jl. Purnawarman 13-15 Bandung, BEC-1 Lt 2 B-01 (Compumax)', phones: ['022-4222962'] },
                ]
            },
            { name: 'Bogor', branches: [{ address: 'Perum Budi Agung Blok P, Jl. Bungur No.5b Bogor', phones: [] }] },
            { name: 'Garut', branches: [{ address: 'Jl. Cimanuk 76/511 Garut (Malibu Computer)', phones: ['0262-2800497'] }] },
        ],
    },
    {
        name: 'Yogyakarta',
        cities: [
            { name: 'Yogyakarta', branches: [{ address: 'Jl. Mojo No 24b Kota Jogja', phones: ['(0274) 3207252'] }] },
        ],
    },
    {
        name: 'Sumatera',
        cities: [
            { name: 'Lampung', branches: [{ address: 'Jl. Raden Intan 61 Enggal, Tanjung Karang Pusat, Bandarlampung', phones: ['(0721) 263734'] }] },
            { name: 'Metro', branches: [{ address: 'Jl. Cut Nyak Dien No.24 A-B Metro, Lampung', phones: ['(0725) 7852788'] }] },
        ],
    },
    {
        name: 'Kalimantan',
        cities: [
            { name: 'Banjarmasin', branches: [{ address: 'Jl. Raya Banjar Indah No.152 RT.11 Kota Banjarmasin', phones: ['(0511) 6742545'] }] },
            { name: 'Kaltim', branches: [{ address: 'Jl. S.I. Khaliludin, Gg. Citra 2 No.33, Tanah Grogot, Kalimantan Timur 76251', phones: ['0852-4611-9450'] }] },
        ],
    },
    {
        name: 'Papua',
        cities: [
            { name: 'Serui', branches: [{ address: 'Jl. Stevanus Rumbewas Serui', phones: ['(0983) 33056'] }] },
        ],
    },
]