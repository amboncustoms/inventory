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
          code: '112211',
          description: 'alat kebersihan bagus',
          name: 'kain pel',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'kain pel bagus',
              price: 12345,
              quantity: 50,
            },
          },
        },
        {
          code: '112222',
          description: 'alat kebersihan bagus',
          name: 'kanebo kering',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'kanebo kering bagus',
              price: 123,
              quantity: 50,
            },
          },
        },
      ],
    },
  },
  {
    title: 'alat komputer',
    products: {
      create: [
        {
          code: '113311',
          description: 'alat komputer bagus',
          name: 'SSD 256 GB',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'SSD bagus',
              price: 13264,
              quantity: 50,
            },
          },
        },
        {
          code: '113322',
          description: 'alat komputer bagus',
          name: 'Hardisk 500 GB',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Hardisk bagus',
              price: 13265,
              quantity: 50,
            },
          },
        },
      ],
    },
  },
  {
    title: 'alat kendaraan',
    products: {
      create: [
        {
          code: '114422',
          description: 'alat kendaraan bagus',
          name: 'Stella Mobil Kaca',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Stella Mobil Kaca bagus',
              price: 13262,
              quantity: 50,
            },
          },
        },
        {
          code: '114411',
          description: 'alat kendaraan bagus',
          name: 'Ban Auldi',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Stella Mobil Kaca bagus',
              price: 14262,
              quantity: 50,
            },
          },
        },
        {
          code: '114433',
          description: 'alat kendaraan bagus',
          name: 'Knalpot racing',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'knalpot racing bagus',
              price: 13262,
              quantity: 50,
            },
          },
        },
      ],
    },
  },
  {
    title: 'obat obatan',
    products: {
      create: [
        {
          code: '115511',
          description: 'alat kendaraan bagus',
          name: 'Minyak Kayu Putih',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Minyak Kayu Putih bagus',
              price: 13262,
              quantity: 50,
            },
          },
        },
        {
          code: '115522',
          description: 'obat obatan bagus',
          name: 'Minyak Telon',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Minyak Kayu Putih bagus',
              price: 13262,
              quantity: 50,
            },
          },
        },
      ],
    },
  },
  {
    title: 'alat listrik',
    products: {
      create: [
        {
          code: '116611',
          description: 'alat listrik bagus',
          name: 'Bohlam LED',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Bohlam LED bagus',
              price: 13262,
              quantity: 50,
            },
          },
        },
        {
          code: '116622',
          description: 'alat listrik bagus',
          name: 'Bohlam LED 5W',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Bohlam LED bagus',
              price: 13264,
              quantity: 50,
            },
          },
        },
      ],
    },
  },

  {
    title: 'alat tulis kantor',
    products: {
      create: [
        {
          code: '116611',
          description: 'alat tulis kantor bagus',
          name: 'Pensil',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Pensil bagus',
              price: 13262,
              quantity: 50,
            },
          },
        },
        {
          code: '116633',
          description: 'alat tulis kantor bagus',
          name: 'Pulpen',
          latestQuantity: 50,
          stocks: {
            create: {
              description: 'Pensil bagus',
              price: 13262,
              quantity: 50,
            },
          },
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
    username: 'kasubbagumum',
    password: '123',
    fullname: 'Kasubbag Umum',
    role: Role.KSBU,
  },
  {
    username: 'rumahtangga',
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
];
