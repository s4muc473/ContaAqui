// Dados de exemplo usados com ?demo=1, importados de um backup real do app.
// Ficam numa chave de localStorage separada e nunca encostam nos dados reais.

const DEMO = {
  "transactions": [
    {
      "id": "t1",
      "amount": 2520,
      "date": "2026-05-15T12:00:00.000Z",
      "type": "ENTRY",
      "description": "Total de entradas - Maio/2026"
    },
    {
      "id": "t2",
      "amount": 2315.9,
      "date": "2026-05-20T12:00:00.000Z",
      "type": "EXPENSE",
      "description": "Total de saídas - Maio/2026",
      "fromId": "budget-monthly"
    },
    {
      "id": "t3",
      "amount": 2918,
      "date": "2026-04-15T12:00:00.000Z",
      "type": "ENTRY",
      "description": "Total de entradas - Abril/2026"
    },
    {
      "id": "t4",
      "amount": 3024,
      "date": "2026-04-20T12:00:00.000Z",
      "type": "EXPENSE",
      "description": "Total de saídas - Abril/2026",
      "fromId": "budget-monthly"
    },
    {
      "id": "t5",
      "amount": 1940,
      "date": "2026-03-15T12:00:00.000Z",
      "type": "ENTRY",
      "description": "Total de entradas - Março/2026"
    },
    {
      "id": "t6",
      "amount": 2567,
      "date": "2026-03-20T12:00:00.000Z",
      "type": "EXPENSE",
      "description": "Total de saídas - Março/2026",
      "fromId": "budget-monthly"
    },
    {
      "id": "t7",
      "amount": 2346,
      "date": "2026-02-15T12:00:00.000Z",
      "type": "ENTRY",
      "description": "Total de entradas - Fevereiro/2026"
    },
    {
      "id": "t8",
      "amount": 2893,
      "date": "2026-02-20T12:00:00.000Z",
      "type": "EXPENSE",
      "description": "Total de saídas - Fevereiro/2026",
      "fromId": "budget-monthly"
    },
    {
      "id": "t9",
      "amount": 1890,
      "date": "2026-01-15T12:00:00.000Z",
      "type": "ENTRY",
      "description": "Total de entradas - Janeiro/2026"
    },
    {
      "id": "t10",
      "amount": 2156.5,
      "date": "2026-01-20T12:00:00.000Z",
      "type": "EXPENSE",
      "description": "Total de saídas - Janeiro/2026",
      "fromId": "budget-monthly"
    },
    {
      "id": "t11",
      "amount": 1500,
      "date": "2025-12-15T12:00:00.000Z",
      "type": "ENTRY",
      "description": "Total de entradas - Dezembro/2025"
    },
    {
      "id": "t12",
      "amount": 1820,
      "date": "2025-12-20T12:00:00.000Z",
      "type": "EXPENSE",
      "description": "Total de saídas - Dezembro/2025",
      "fromId": "budget-monthly"
    },
    {
      "id": "3le4445nmry2o73f",
      "amount": 750,
      "date": "2026-07-23T22:17:51.339Z",
      "type": "ENTRY",
      "description": "Salário"
    },
    {
      "id": "ymq3bxp1mry2qar4",
      "amount": 377,
      "date": "2026-07-23T22:19:29.392Z",
      "type": "ENTRY",
      "description": "Salário"
    },
    {
      "id": "t80yhzhumry2u7v4",
      "amount": 600,
      "date": "2026-07-23T22:22:32.272Z",
      "type": "ENTRY",
      "description": "Salário"
    },
    {
      "id": "0bk0qwurmry2uwk4",
      "amount": 600,
      "date": "2026-07-23T22:23:04.276Z",
      "type": "EXPENSE",
      "description": "Gastos não Registrados",
      "fromId": "budget-monthly"
    },
    {
      "id": "mrvr2xvpmrz9xpxi",
      "amount": 42,
      "date": "2026-07-24T18:28:59.142Z",
      "type": "EXPENSE",
      "description": "Internet",
      "fromId": "budget-monthly"
    },
    {
      "id": "j1uzoybgmrzhk5oc",
      "amount": 31,
      "date": "2026-07-24T22:02:23.292Z",
      "type": "EXPENSE",
      "description": "Encanação",
      "fromId": "budget-monthly"
    },
    {
      "id": "h5yhtyy2ms0gs7mn",
      "amount": 750,
      "date": "2026-07-25T14:28:25.631Z",
      "type": "ENTRY",
      "description": "Prestação da Moto"
    },
    {
      "id": "vynf0v0qms0okd0c",
      "amount": 90,
      "date": "2026-07-25T18:06:16.284Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "7pd7990oms6aqtr3",
      "amount": 20.5,
      "date": "2026-07-29T16:26:00.351Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "6cumzckwms90e70i",
      "amount": 35,
      "date": "2026-07-31T13:59:33.378Z",
      "type": "EXPENSE",
      "description": "Pneu",
      "fromId": "budget-monthly"
    },
    {
      "id": "r5232g6sms90efi6",
      "amount": 14,
      "date": "2026-07-31T13:59:44.382Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "4t08ft3bmsf9m4ba",
      "amount": 44,
      "date": "2026-08-04T23:04:16.726Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "zj8thxn5mshgxnc0",
      "amount": 50,
      "date": "2026-08-06T12:04:44.256Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "gy4jzd3emshgy86l",
      "amount": 714,
      "date": "2026-08-06T12:05:11.277Z",
      "type": "ENTRY",
      "description": "Salário"
    },
    {
      "id": "ey1pf4eqmshgylyb",
      "amount": 750,
      "date": "2026-08-06T12:05:29.123Z",
      "type": "ENTRY",
      "description": "Salário"
    },
    {
      "id": "hrack1iymshgznxb",
      "amount": 201,
      "date": "2026-08-06T12:06:18.335Z",
      "type": "EXPENSE",
      "description": "Fatura do Cartão",
      "fromId": "budget-monthly"
    },
    {
      "id": "efzv7952mshh0gz9",
      "amount": 60,
      "date": "2026-08-06T12:06:55.989Z",
      "type": "EXPENSE",
      "description": "Acadêmia da Muié",
      "fromId": "budget-monthly"
    },
    {
      "id": "m9fw6katmshh3gc1",
      "amount": 78,
      "date": "2026-08-06T12:09:15.121Z",
      "type": "EXPENSE",
      "description": "Fatura do cartão",
      "fromId": "budget-monthly"
    },
    {
      "id": "tmksvkkamsi0f8xf",
      "amount": 50,
      "date": "2026-08-06T21:10:18.099Z",
      "type": "EXPENSE",
      "description": "Troca de Óleo da Moto",
      "fromId": "budget-monthly"
    },
    {
      "id": "qt36y16lmsi96s2c",
      "amount": 24,
      "date": "2026-08-07T01:15:39.540Z",
      "type": "EXPENSE",
      "description": "Spotify",
      "fromId": "budget-monthly"
    },
    {
      "id": "d8nmn1ozmslucjz4",
      "amount": 270,
      "date": "2026-08-09T13:31:19.456Z",
      "type": "ENTRY",
      "description": "Projeto"
    },
    {
      "id": "7mq8x364mslud0ij",
      "amount": 31,
      "date": "2026-08-09T13:31:40.891Z",
      "type": "EXPENSE",
      "description": "Fatura do Chip",
      "fromId": "budget-monthly"
    },
    {
      "id": "ez76oqoamsnhrqqz",
      "amount": 35,
      "date": "2026-08-10T17:14:45.419Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "ihpqc5rgmsnhrvqk",
      "amount": 15,
      "date": "2026-08-10T17:14:51.884Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "hx3ri6jdmsnhs16g",
      "amount": 24,
      "date": "2026-08-10T17:14:58.936Z",
      "type": "EXPENSE",
      "description": "Café da manhã",
      "fromId": "budget-monthly"
    },
    {
      "id": "538bkslnmsnhttox",
      "amount": 57,
      "date": "2026-08-10T17:16:22.545Z",
      "type": "EXPENSE",
      "description": "Muié",
      "fromId": "budget-monthly"
    },
    {
      "id": "e0g6hc9lmsnu9wb2",
      "amount": 7,
      "date": "2026-08-10T23:04:47.822Z",
      "type": "EXPENSE",
      "description": "Lanche",
      "fromId": "budget-monthly"
    },
    {
      "id": "uvw5tyhsmsqoj01y",
      "amount": 60,
      "date": "2026-08-12T22:47:13.414Z",
      "type": "EXPENSE",
      "description": "Muié",
      "fromId": "budget-monthly"
    },
    {
      "id": "06emdvjjmsqojcwm",
      "amount": 23,
      "date": "2026-08-12T22:47:30.070Z",
      "type": "EXPENSE",
      "description": "Lanche",
      "fromId": "budget-monthly"
    },
    {
      "id": "opbxdfuymst1nxe8",
      "amount": 457,
      "date": "2026-08-14T14:30:30.608Z",
      "type": "ENTRY",
      "description": "Férias"
    },
    {
      "id": "xpkvpntdmst4j8aq",
      "amount": 60,
      "date": "2026-08-14T15:50:50.306Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "840w3kybmst56be7",
      "amount": 113,
      "date": "2026-08-14T16:08:47.407Z",
      "type": "EXPENSE",
      "description": "Capacete",
      "fromId": "budget-monthly"
    },
    {
      "id": "pf3bw221msue6ype",
      "amount": 70,
      "date": "2026-08-15T13:09:00.338Z",
      "type": "EXPENSE",
      "description": "Internet",
      "fromId": "budget-monthly"
    },
    {
      "id": "b6995c6kmsufcuxp",
      "amount": 186,
      "date": "2026-08-15T13:41:35.005Z",
      "type": "EXPENSE",
      "description": "Gás",
      "fromId": "budget-monthly"
    },
    {
      "id": "am9ruimmmsufob28",
      "amount": 115,
      "date": "2026-08-15T13:50:29.120Z",
      "type": "EXPENSE",
      "description": "Pneu",
      "fromId": "budget-monthly"
    },
    {
      "id": "d7gisgdpmsujsakl",
      "amount": 12,
      "date": "2026-08-15T15:45:33.573Z",
      "type": "EXPENSE",
      "description": "Coca",
      "fromId": "budget-monthly"
    },
    {
      "id": "ryrpx4z0msywhnv6",
      "amount": 23,
      "date": "2026-08-18T16:52:17.298Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "n5t3qwkhmsza421o",
      "amount": 28,
      "date": "2026-08-18T23:13:37.116Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "psjb75cgmt1ern06",
      "amount": 13,
      "date": "2026-08-20T10:59:28.182Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "aqhbym4imt1gux5n",
      "amount": 50,
      "date": "2026-08-20T11:58:00.539Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "qbjcpfwwmt4e0h73",
      "amount": 35,
      "date": "2026-08-22T13:01:39.471Z",
      "type": "EXPENSE",
      "description": "Serviço",
      "fromId": "budget-monthly"
    },
    {
      "id": "w3rrwerdmt4e0nn3",
      "amount": 14,
      "date": "2026-08-22T13:01:47.823Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "mgxuwvs2mt4e1ao6",
      "amount": 8,
      "date": "2026-08-22T13:02:17.670Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "lla8g4nnmt4e1juy",
      "amount": 100,
      "date": "2026-08-22T13:02:29.578Z",
      "type": "ENTRY",
      "description": "Serviço"
    },
    {
      "id": "qldx07p7mt4t4dmd",
      "amount": 22.5,
      "date": "2026-08-22T20:04:35.701Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "dal372nmmt74b0d3",
      "amount": 50,
      "date": "2026-08-24T10:53:13.239Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "1mdavketmt74osmc",
      "amount": 10,
      "date": "2026-08-24T11:03:56.388Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "58e5i0admtd2p4gp",
      "amount": 8,
      "date": "2026-08-28T14:54:49.561Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "b9kbtomrmtd5anbc",
      "amount": 21,
      "date": "2026-08-28T16:07:33.000Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "qv4vemjzmthei6bj",
      "amount": 46,
      "date": "2026-08-31T15:36:25.471Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "zioi440emtj5553f",
      "amount": 26,
      "date": "2026-09-01T20:49:53.163Z",
      "type": "EXPENSE",
      "description": "Sorvete",
      "fromId": "budget-monthly"
    },
    {
      "id": "yhrb8lmvmtj56eg4",
      "amount": 100,
      "date": "2026-09-01T20:50:51.940Z",
      "type": "ENTRY",
      "description": "Pagamento de dividas"
    },
    {
      "id": "psfkk623mtlr4ejl",
      "amount": 48,
      "date": "2026-09-03T16:40:42.657Z",
      "type": "EXPENSE",
      "description": "Almoço e lanche",
      "fromId": "budget-monthly"
    },
    {
      "id": "css6y957mtmyndq8",
      "amount": 1379,
      "date": "2026-09-04T12:59:11.552Z",
      "type": "ENTRY",
      "description": "Salário"
    },
    {
      "id": "hwfacc5hmtmyoh9x",
      "amount": 60,
      "date": "2026-09-04T13:00:02.805Z",
      "type": "EXPENSE",
      "description": "Academia da mulher",
      "fromId": "budget-monthly"
    },
    {
      "id": "qe2saifvmtmyq3fa",
      "amount": 20,
      "date": "2026-09-04T13:01:18.166Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "r5bgaw8emtmz1jc1",
      "amount": 315,
      "date": "2026-09-04T13:10:12.001Z",
      "type": "EXPENSE",
      "description": "Contas",
      "fromId": "budget-monthly"
    },
    {
      "id": "1jjh1vfymtndlhp2",
      "amount": 103,
      "date": "2026-09-04T19:57:37.622Z",
      "type": "EXPENSE",
      "description": "Manutenção da Moto",
      "fromId": "budget-monthly"
    },
    {
      "id": "g7dzvyz3mtnfu8k0",
      "amount": 50,
      "date": "2026-09-04T21:00:24.912Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "2g37tzr9mtrg4tq4",
      "amount": 100,
      "date": "2026-09-07T16:19:43.612Z",
      "type": "ENTRY",
      "description": "Pagamento de Dívidas"
    },
    {
      "id": "d292p2gkmtrwwlr0",
      "amount": 50,
      "date": "2026-09-08T00:09:13.500Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "jx8vduh7mtssszvo",
      "amount": 17,
      "date": "2026-09-08T15:02:12.900Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "gor97iy0mtud1pls",
      "amount": 22,
      "date": "2026-09-09T17:16:37.984Z",
      "type": "EXPENSE",
      "description": "Almoço",
      "fromId": "budget-monthly"
    },
    {
      "id": "d00xu3vbmtuhemic",
      "amount": 8,
      "date": "2026-09-09T19:18:38.964Z",
      "type": "EXPENSE",
      "description": "Ajuste manual -R$ 8,00",
      "fromId": "budget-monthly"
    },
    {
      "id": "6n3d2a36mtwy1t1y",
      "amount": 51,
      "date": "2026-09-11T12:40:06.742Z",
      "type": "EXPENSE",
      "description": "Fatura",
      "fromId": "budget-monthly"
    },
    {
      "id": "qnstzugemtwy260k",
      "amount": 7,
      "date": "2026-09-11T12:40:23.540Z",
      "type": "EXPENSE",
      "description": "Leite",
      "fromId": "budget-monthly"
    },
    {
      "id": "o6dm8w7vmtwy2p32",
      "amount": 25,
      "date": "2026-09-11T12:40:48.254Z",
      "type": "EXPENSE",
      "description": "Presente",
      "fromId": "budget-monthly"
    },
    {
      "id": "kqyksd1ymtwy2v9g",
      "amount": 12,
      "date": "2026-09-11T12:40:56.260Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "3xmyrousmtwy3ekt",
      "amount": 250,
      "date": "2026-09-11T12:41:21.293Z",
      "type": "ENTRY",
      "description": "Bonificação"
    },
    {
      "id": "gzylaizemtx6mx7r",
      "amount": 28.5,
      "date": "2026-09-11T16:40:28.839Z",
      "type": "EXPENSE",
      "description": "Almoço",
      "fromId": "budget-monthly"
    },
    {
      "id": "n2lw1w2kmtyfpznv",
      "amount": 70,
      "date": "2026-09-12T13:42:34.699Z",
      "type": "EXPENSE",
      "description": "Internet",
      "fromId": "budget-monthly"
    },
    {
      "id": "wypjypi8mtytf0ei",
      "amount": 45,
      "date": "2026-09-12T20:05:57.066Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "5n1hrgpnmu18he8o",
      "amount": 60,
      "date": "2026-09-14T12:43:14.904Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "gxfxtkcpmu18hinq",
      "amount": 18,
      "date": "2026-09-14T12:43:20.630Z",
      "type": "EXPENSE",
      "description": "Sorvete",
      "fromId": "budget-monthly"
    },
    {
      "id": "qqrh2kzkmu266kin",
      "amount": 150,
      "date": "2026-09-15T04:26:36.767Z",
      "type": "ENTRY",
      "description": "Empréstimo"
    },
    {
      "id": "to5j638bmu44pxnw",
      "amount": 20,
      "date": "2026-09-16T13:21:13.388Z",
      "type": "EXPENSE",
      "description": "Salgados",
      "fromId": "budget-monthly"
    },
    {
      "id": "1qxsvcjamu4o6gh9",
      "amount": 96,
      "date": "2026-09-16T22:25:56.973Z",
      "type": "ENTRY",
      "description": "Empréstimo"
    },
    {
      "id": "fz3vfvd5mu6au993",
      "amount": 20,
      "date": "2026-09-18T01:48:05.079Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "f10gnav3mu78pl01",
      "amount": 30,
      "date": "2026-09-18T17:36:13.969Z",
      "type": "EXPENSE",
      "description": "Emprestado",
      "fromId": "budget-monthly"
    },
    {
      "id": "9xk2y8qtmu78pqks",
      "amount": 17,
      "date": "2026-09-18T17:36:21.196Z",
      "type": "EXPENSE",
      "description": "Almoço",
      "fromId": "budget-monthly"
    },
    {
      "id": "26lqj37emu8bn83w",
      "amount": 14,
      "date": "2026-09-19T11:46:08.972Z",
      "type": "EXPENSE",
      "description": "Café",
      "fromId": "budget-monthly"
    },
    {
      "id": "6olen2zpmu8bnirz",
      "amount": 20,
      "date": "2026-09-19T11:46:22.799Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "dwat62w7mu9u620v",
      "amount": 85,
      "date": "2026-09-20T13:12:26.815Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "om5nvioimu9vfln3",
      "amount": 20,
      "date": "2026-09-20T13:47:51.759Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "8gfa8jd2mudd48cu",
      "amount": 22,
      "date": "2026-09-23T00:26:12.942Z",
      "type": "EXPENSE",
      "description": "Almoço",
      "fromId": "budget-monthly"
    },
    {
      "id": "duvok9dhmudd4ik1",
      "amount": 7,
      "date": "2026-09-23T00:26:26.161Z",
      "type": "EXPENSE",
      "description": "Manutenção moto",
      "fromId": "budget-monthly"
    },
    {
      "id": "wly9zf58mudd60kl",
      "amount": 4,
      "date": "2026-09-23T00:27:36.165Z",
      "type": "EXPENSE",
      "description": "Fita",
      "fromId": "budget-monthly"
    },
    {
      "id": "ucjqt4nbmulz1nux",
      "amount": 50,
      "date": "2026-09-29T01:02:14.025Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "5sluq5dzmulz1t5f",
      "amount": 25,
      "date": "2026-09-29T01:02:20.883Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "bgiskwzsmulz1xwl",
      "amount": 10,
      "date": "2026-09-29T01:02:27.045Z",
      "type": "EXPENSE",
      "description": "Cachorro",
      "fromId": "budget-monthly"
    },
    {
      "id": "1n4hq62smulz23qh",
      "amount": 15,
      "date": "2026-09-29T01:02:34.601Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "86vnedzomupprndx",
      "amount": 14,
      "date": "2026-10-01T15:53:35.013Z",
      "type": "EXPENSE",
      "description": "Almoço",
      "fromId": "budget-monthly"
    },
    {
      "id": "52nwo4i3mupps01f",
      "amount": 60,
      "date": "2026-10-01T15:53:51.411Z",
      "type": "ENTRY",
      "description": "Empréstimo"
    },
    {
      "id": "o5co11szmuppsval",
      "amount": 30,
      "date": "2026-10-01T15:54:31.917Z",
      "type": "EXPENSE",
      "description": "Gasolina",
      "fromId": "budget-monthly"
    },
    {
      "id": "bqvqm48smur7c3cv",
      "amount": 19,
      "date": "2026-10-02T16:53:08.479Z",
      "type": "EXPENSE",
      "description": "Almoço",
      "fromId": "budget-monthly"
    },
    {
      "id": "pwwkhe34mur7cbfv",
      "amount": 100,
      "date": "2026-10-02T16:53:18.955Z",
      "type": "ENTRY",
      "description": "Empréstimo"
    },
    {
      "id": "qmcequxrmusj9gt0",
      "amount": 10,
      "date": "2026-10-03T15:14:47.508Z",
      "type": "EXPENSE",
      "description": "Mantimentos",
      "fromId": "budget-monthly"
    },
    {
      "id": "0h27fwubmuvc2csd",
      "amount": 150,
      "date": "2026-10-05T14:16:36.925Z",
      "type": "ENTRY",
      "description": "Devolução"
    },
    {
      "id": "y9bwga6umuvszuut",
      "amount": 10,
      "date": "2026-10-05T22:10:33.845Z",
      "type": "EXPENSE",
      "description": "Janta",
      "fromId": "budget-monthly"
    },
    {
      "id": "phr1luqymuvxdzss",
      "amount": 26,
      "date": "2026-10-06T00:13:31.900Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-30obbu0jmuvxbqpg"
    },
    {
      "id": "gjvv25jzmuwlhpqa",
      "amount": 5,
      "date": "2026-10-06T11:28:16.258Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "56bc2rrcmuwow7a8",
      "amount": 1710,
      "date": "2026-10-06T13:03:31.040Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-0bbmnid1muvxd34q"
    },
    {
      "id": "as527zv8muwowh41",
      "amount": 181,
      "date": "2026-10-06T13:03:43.777Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-6v20u252muvxdmes"
    },
    {
      "id": "w5qvgxrdmuwtcgm5",
      "amount": 90,
      "date": "2026-10-06T15:08:08.093Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-25pn1r99muvxf68p"
    },
    {
      "id": "x0vb7063muwtczmy",
      "amount": 1407,
      "date": "2026-10-06T15:08:32.746Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-2y0v28ihmuvxbt3p"
    },
    {
      "id": "654c901wmuwz6pr9",
      "amount": 450,
      "date": "2026-10-06T17:51:37.701Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-6v20u252muvxdmes"
    },
    {
      "id": "w555hvefmuwz7m4q",
      "amount": 6,
      "date": "2026-10-06T17:52:19.658Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-25pn1r99muvxf68p"
    },
    {
      "id": "tf0weyb0muwz7rk8",
      "amount": 30,
      "date": "2026-10-06T17:52:26.696Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-ywdidhq8muvxb26t"
    },
    {
      "id": "5pc6no0qmuwzeaa3",
      "amount": 315,
      "date": "2026-10-06T17:57:30.891Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-6v20u252muvxdmes"
    },
    {
      "id": "rquzt5zamux3wr20",
      "amount": 30,
      "date": "2026-10-06T20:03:50.904Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-9zmtnu3amuvxb9hs"
    },
    {
      "id": "6jm8eifwmux8l261",
      "amount": 124,
      "date": "2026-10-06T22:14:43.513Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-xg0fxtybmux8ky6v"
    },
    {
      "id": "4nr3avb8mux8mowu",
      "amount": 9,
      "date": "2026-10-06T22:15:59.646Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "fddylcjimuy4iszs",
      "amount": 15,
      "date": "2026-10-07T13:08:46.024Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-ynvtf5hwmuvxcbt0"
    },
    {
      "id": "8a5c3bxvmuylkbrp",
      "amount": 5,
      "date": "2026-10-07T21:05:50.485Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-6v20u252muvxdmes"
    },
    {
      "id": "3oxf4aewmv04xyuq",
      "amount": 6,
      "date": "2026-10-08T22:56:05.810Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-mbjkc88imuvxbfl4"
    },
    {
      "id": "w86jxyzxmv2y821u",
      "amount": 16,
      "date": "2026-10-10T22:11:17.730Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "wiq1i2vjmv5id0gv",
      "amount": 70,
      "date": "2026-10-12T17:10:33.631Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-ved1eqgumv5icsv8"
    },
    {
      "id": "qynctahgmv6x5v9k",
      "amount": 30,
      "date": "2026-10-13T16:52:40.712Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "8d7h60mymv6xlg0n",
      "amount": 6,
      "date": "2026-10-13T17:04:47.447Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "nr54foxymv782g43",
      "amount": 13,
      "date": "2026-10-13T21:57:56.883Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "i1mw6h81mv8ijxww",
      "amount": 750,
      "date": "2026-10-06T15:00:00.000Z",
      "type": "EXPENSE",
      "description": "Ajuste de saída",
      "categoryId": "cat-srw5rjjkmuvxewze",
      "historicalAdjustment": true,
      "budgetName": "Ajuste histórico"
    },
    {
      "id": "jmqr0hp4mv8ir04z",
      "amount": 750,
      "date": "2026-09-15T15:00:00.000Z",
      "type": "EXPENSE",
      "description": "Ajuste de saída",
      "categoryId": "cat-srw5rjjkmuvxewze",
      "historicalAdjustment": true,
      "budgetName": "Ajuste histórico"
    },
    {
      "id": "e4xo6z56mv8irtay",
      "amount": 750,
      "date": "2026-08-15T15:00:00.000Z",
      "type": "EXPENSE",
      "description": "Ajuste de saída",
      "categoryId": "cat-srw5rjjkmuvxewze",
      "historicalAdjustment": true,
      "budgetName": "Ajuste histórico"
    },
    {
      "id": "wso5j84qmv8is24p",
      "amount": 150,
      "date": "2026-08-15T15:00:00.000Z",
      "type": "EXPENSE",
      "description": "Ajuste de saída",
      "categoryId": "cat-7anldpunmux8lzs4",
      "historicalAdjustment": true,
      "budgetName": "Ajuste histórico"
    },
    {
      "id": "uzzhv962mv8isthk",
      "amount": 750,
      "date": "2026-07-15T15:00:00.000Z",
      "type": "EXPENSE",
      "description": "Ajuste de saída",
      "categoryId": "cat-srw5rjjkmuvxewze",
      "historicalAdjustment": true,
      "budgetName": "Ajuste histórico"
    },
    {
      "id": "62y3m4oumv9l3ejv",
      "amount": 3,
      "date": "2026-10-15T13:38:08.875Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-3ip6t20zmuvxcr8f"
    },
    {
      "id": "8o8p2g3wmv9vaizr",
      "amount": 17,
      "date": "2026-10-15T18:23:37.383Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "yu23b3msmva7og0q",
      "amount": 10,
      "date": "2026-10-16T00:10:22.106Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-25pn1r99muvxf68p"
    },
    {
      "id": "kn6bck4imvb3juhe",
      "amount": 120,
      "date": "2026-10-16T15:02:35.282Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-xg0fxtybmux8ky6v"
    },
    {
      "id": "q95jzk14mvb3kcwl",
      "amount": 51,
      "date": "2026-10-16T15:02:59.157Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-2y0v28ihmuvxbt3p"
    },
    {
      "id": "7k1jospymvb4l5hi",
      "amount": 500,
      "date": "2026-07-15T15:00:00.000Z",
      "type": "EXPENSE",
      "description": "Ajuste de saída",
      "categoryId": "cat-mbjkc88imuvxbfl4",
      "historicalAdjustment": true,
      "budgetName": "Ajuste histórico"
    },
    {
      "id": "m6bzi8lqmvb4lhid",
      "amount": 300,
      "date": "2026-07-15T15:00:00.000Z",
      "type": "EXPENSE",
      "description": "Ajuste de saída",
      "categoryId": "cat-9zmtnu3amuvxb9hs",
      "historicalAdjustment": true,
      "budgetName": "Ajuste histórico"
    },
    {
      "id": "mj8pndxnmvbiyuun",
      "amount": 20,
      "date": "2026-10-16T22:14:09.839Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-1vv5a6l6mvbiymvi"
    },
    {
      "id": "c232ffz2mvdzixqw",
      "amount": 70,
      "date": "2026-10-18T15:33:12.920Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-ywdidhq8muvxb26t"
    },
    {
      "id": "f51tbstcmvdzj4ml",
      "amount": 53,
      "date": "2026-10-18T15:33:21.837Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-mbjkc88imuvxbfl4"
    },
    {
      "id": "jpudlfiymvdzlin2",
      "amount": 42,
      "date": "2026-10-18T15:35:13.310Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-9zmtnu3amuvxb9hs"
    },
    {
      "id": "2lh1795umvdzmzdf",
      "amount": 12,
      "date": "2026-10-18T15:36:21.651Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "0cnn03afmvf850ha",
      "amount": 7,
      "date": "2026-10-19T12:22:05.998Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "dwex9ctomvgq8u5e",
      "amount": 55,
      "date": "2026-10-20T13:36:43.682Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-30obbu0jmuvxbqpg"
    },
    {
      "id": "1uk6hgs0mvjrh3xx",
      "amount": 24,
      "date": "2026-10-22T16:34:27.765Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-yoxuoiixmuwlhgsu"
    },
    {
      "id": "18qe42p1mvkenmos",
      "amount": 20,
      "date": "2026-10-23T03:23:23.164Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-ywdidhq8muvxb26t"
    },
    {
      "id": "6xkz0u53mvtgp0r6",
      "amount": 28,
      "date": "2026-10-29T11:30:22.866Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-ywdidhq8muvxb26t"
    },
    {
      "id": "wxmmynxpmvtgp835",
      "amount": 1078,
      "date": "2026-10-29T11:30:32.369Z",
      "type": "ENTRY",
      "description": "Entrada",
      "categoryId": "cat-6v20u252muvxdmes"
    },
    {
      "id": "9tg0zojemvtr1t9z",
      "amount": 136,
      "date": "2026-10-29T16:20:15.863Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-30obbu0jmuvxbqpg"
    },
    {
      "id": "hmvvdlajmvtr985h",
      "amount": 5,
      "date": "2026-10-29T16:26:01.733Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais"
    },
    {
      "id": "0a5imr2nmvtrsqbi",
      "amount": 37,
      "date": "2026-10-29T16:41:11.742Z",
      "type": "EXPENSE",
      "description": "Saída",
      "fromId": "budget-monthly",
      "budgetName": "Gastos Gerais",
      "categoryId": "cat-ywdidhq8muvxb26t"
    }
  ],
  "reserves": [
    {
      "color": "#7c3aed",
      "id": "reserve-emergency",
      "name": "Reservas Administrativa",
      "currentBalance": 0,
      "goal": {
        "enabled": true,
        "targetAmount": 1500,
        "startCycle": "2026-10",
        "endCycle": "2026-11"
      }
    }
  ],
  "cycleStartDay": 4,
  "categories": [
    {
      "id": "cat-ywdidhq8muvxb26t",
      "name": "Gasolina",
      "type": "EXPENSE",
      "color": "#f59e0b"
    },
    {
      "id": "cat-9zmtnu3amuvxb9hs",
      "name": "Manutenção Moto",
      "type": "EXPENSE",
      "color": "#e11d48"
    },
    {
      "id": "cat-mbjkc88imuvxbfl4",
      "name": "Mantimentos",
      "type": "EXPENSE",
      "color": "#f59e0b"
    },
    {
      "id": "cat-30obbu0jmuvxbqpg",
      "name": "Emprestimos",
      "type": "EXPENSE",
      "color": "#be123c"
    },
    {
      "id": "cat-2y0v28ihmuvxbt3p",
      "name": "Cartão",
      "type": "EXPENSE",
      "color": "#e11d48"
    },
    {
      "id": "cat-ynvtf5hwmuvxcbt0",
      "name": "Cachorro",
      "type": "EXPENSE",
      "color": "#f59e0b"
    },
    {
      "id": "cat-2mvv4fhbmuvxcg0d",
      "name": "Casa",
      "type": "EXPENSE",
      "color": "#e11d48"
    },
    {
      "id": "cat-3ip6t20zmuvxcr8f",
      "name": "Mulher",
      "type": "EXPENSE",
      "color": "#f97316"
    },
    {
      "id": "cat-0bbmnid1muvxd34q",
      "name": "Salário",
      "type": "ENTRY",
      "color": "#10b981"
    },
    {
      "id": "cat-2btxb7aimuvxdbkv",
      "name": "Empréstimos",
      "type": "ENTRY",
      "color": "#14b8a6"
    },
    {
      "id": "cat-6v20u252muvxdmes",
      "name": "Externas",
      "type": "ENTRY",
      "color": "#0d9488"
    },
    {
      "id": "cat-srw5rjjkmuvxewze",
      "name": "Prestação Moto",
      "type": "EXPENSE",
      "color": "#be123c"
    },
    {
      "id": "cat-25pn1r99muvxf68p",
      "name": "Roça & Plantação",
      "type": "EXPENSE",
      "color": "#f59e0b"
    },
    {
      "id": "cat-yoxuoiixmuwlhgsu",
      "name": "Comida",
      "type": "EXPENSE",
      "color": "#e11d48"
    },
    {
      "id": "cat-xg0fxtybmux8ky6v",
      "name": "Crédito",
      "type": "ENTRY",
      "color": "#22c55e"
    },
    {
      "id": "cat-7anldpunmux8lzs4",
      "name": "Luz e Gás",
      "type": "EXPENSE",
      "color": "#f59e0b"
    },
    {
      "id": "cat-ved1eqgumv5icsv8",
      "name": "Internet",
      "type": "EXPENSE",
      "color": "#f59e0b"
    },
    {
      "id": "cat-1vv5a6l6mvbiymvi",
      "name": "Vestimentas",
      "type": "EXPENSE",
      "color": "#ea580c"
    }
  ],
  "schemaVersion": 3,
  "account": 900,
  "profile": {
    "name": "",
    "color": "#16a34a"
  }
};

export function buildDemoState() {
  return structuredClone(DEMO);
}
