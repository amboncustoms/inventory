// eslint-disable-next-line no-unused-vars
enum Role {
  // eslint-disable-next-line no-unused-vars
  KSBU = 'KSBU',
  // eslint-disable-next-line no-unused-vars
  RT = 'RT',
  // eslint-disable-next-line no-unused-vars
  USER = 'USER',
}

export const categories = [
  {
    title: 'alat kebersihan',
    products: {
      create: [
        {
          code: '1016862',
          description: 'alat kebersihan bagus',
          name: 'kain pel',
          latestQuantity: 0,
        },
        {
          code: '0384048',
          description: 'alat kebersihan bagus',
          name: 'sabun lantai',
          latestQuantity: 0,
        },
      ],
    },
  },
  {
    title: 'alat komputer',
    products: {
      create: [
        {
          code: '8EAB1DC',
          description: 'alat komputer bagus',
          name: 'SSD 256 GB',
          latestQuantity: 0,
        },
        {
          code: '71F8F59',
          description: 'alat komputer bagus',
          name: 'Hardisk 500 GB',
          latestQuantity: 0,
        },
        {
          code: '756479R',
          description: 'alat komputer bagus',
          name: 'Hardisk 500 GB',
          latestQuantity: 0,
        },
      ],
    },
  },
  {
    title: 'alat kendaraan',
    products: {
      create: [
        {
          code: '019E446',
          description: 'alat kendaraan bagus',
          name: 'Pewangi kendaraan',
          latestQuantity: 0,
        },
        {
          code: '1F840CB',
          description: 'alat kendaraan bagus',
          name: 'Ban tubles',
          latestQuantity: 0,
        },
        {
          code: 'C2475B0',
          description: 'alat kendaraan bagus',
          name: 'Knalpot AHM',
          latestQuantity: 0,
        },
      ],
    },
  },
  {
    title: 'obat obatan',
    products: {
      create: [
        {
          code: 'A695DD2',
          description: 'alat kendaraan bagus',
          name: 'Minyak Kayu Putih',
          latestQuantity: 0,
        },
        {
          code: 'C43234A',
          description: 'obat obatan bagus',
          name: 'Minyak Telon',
          latestQuantity: 0,
        },
      ],
    },
  },
  {
    title: 'alat listrik',
    products: {
      create: [
        {
          code: 'CA5E421',
          description: 'alat listrik bagus',
          name: 'Bohlam LED',
          latestQuantity: 0,
        },
        {
          code: 'AA3442',
          description: 'alat listrik bagus',
          name: 'Fuse tabung kaca',
          latestQuantity: 0,
        },
      ],
    },
  },

  {
    title: 'alat tulis kantor',
    products: {
      create: [
        {
          code: '4225E84',
          description: 'alat tulis kantor bagus',
          name: 'Pensil',
          latestQuantity: 0,
        },
        {
          code: '9D14499',
          description: 'alat tulis kantor bagus',
          name: 'Pulpen',
          latestQuantity: 0,
        },
      ],
    },
  },
];

export const users = [
  {
    username: 'tama',
    password: '123',
    fullname: 'Tama Gotchi',
  },
  {
    username: 'ksbu',
    password: '123',
    fullname: 'Kasubbag Umum',
    role: Role.KSBU,
  },
  {
    username: 'rt',
    password: '123',
    fullname: 'Rumah Tangga',
    role: Role.RT,
  },
  {
    username: 'pkcdt',
    password: '123',
    fullname: 'Pelayanan Kepabeanan dan Cukai dan Dukungan Teknis',
    role: Role.USER,
  },
  {
    username: 'perbend',
    password: '123',
    fullname: 'Perbendaharaan',
    role: Role.USER,
  },
  {
    username: 'keuangan',
    password: '123',
    fullname: 'Keuangan',
    role: Role.USER,
  },
  {
    username: 'tuk',
    password: '123',
    fullname: 'TUK',
    role: Role.USER,
  },
  {
    username: 'p2',
    password: '123',
    fullname: 'Penindakan dan Penyidikan',
    role: Role.USER,
  },
  {
    username: 'kip',
    password: '123',
    fullname: 'Kepatuhan Internal dan Penyuluhan dan Layanan Informasi',
    role: Role.USER,
  },
];
