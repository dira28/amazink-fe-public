export const brands = [
    { id: 'epson', name: 'Epson' },
    { id: 'canon', name: 'Canon' },
    { id: 'hp', name: 'HP' },
    { id: 'brother', name: 'Brother' },
]

export const groups = [
    {
        id: 'epson-l',
        brand: 'epson',
        label: 'Epson L Series',
        kind: 'Tinta',
        models: [
            'L100', 'L110', 'L120', 'L200', 'L210', 'L220', 'L300', 'L310', 'L350', 'L355', 'L360',
            'L365', 'L455', 'L550', 'L555', 'L565', 'L1110', 'L1300', 'L3100', 'L3101', 'L3110',
            'L3150', 'L3210', 'L5190',
        ],
        products: [
            'amazink-ink-bottle-black',
            'amazink-ink-bottle-cyan',
            'amazink-ink-bottle-magenta',
            'amazink-ink-bottle-yellow',
        ],
        set: 'amazink-ink-bottle-set',
    },
    {
        id: 'hp-laserjet',
        brand: 'hp',
        label: 'HP LaserJet',
        kind: 'Toner',
        models: ['P1102', 'P1102w', 'M1132', 'M1212nf'],
        products: ['amazink-laser-toner-black'],
    },
    {
        id: 'hp-deskjet',
        brand: 'hp',
        label: 'HP DeskJet',
        kind: 'Cartridge',
        models: ['DeskJet 2135', 'DeskJet 2336'],
        products: ['amazink-ink-cartridge-black'],
    },
    {
        id: 'canon-g',
        brand: 'canon',
        label: 'Canon PIXMA G Series',
        kind: 'Tinta',
        models: ['G1010', 'G2010', 'G3010', 'G4010'],
        products: [],
    },
    {
        id: 'brother-hl',
        brand: 'brother',
        label: 'Brother HL Series',
        kind: 'Toner',
        models: ['HL-L2320D', 'HL-L2360DN'],
        products: [],
    },
]