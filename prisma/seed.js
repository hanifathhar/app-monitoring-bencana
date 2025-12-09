import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

    // Buat user admin default
    const hashedPassword = await bcrypt.hash("admin123", 10);

    try {
        await prisma.tbl_user.create({
            data: {
                nama: "Administrator",
                username: "admin",
                password: hashedPassword,
                id_posko: 1,
                role: "admin",
            },
        });
        console.log("✅ User admin berhasil dibuat");
    } catch (error) {
        console.log("ℹ️ User admin sudah ada atau error:", error.message);
    }

    await prisma.tbl_kecamatan.createMany({
        data: [
            { id_kecamatan: 1, nm_kecamatan: "Aek Bilah" },
            { id_kecamatan: 2, nm_kecamatan: "Angkola Barat" },
            { id_kecamatan: 3, nm_kecamatan: "Angkola Muara Tais" },
            { id_kecamatan: 4, nm_kecamatan: "Angkola Sagkunur" },
            { id_kecamatan: 5, nm_kecamatan: "Angkola Selatan" },
            { id_kecamatan: 6, nm_kecamatan: "Angkola Timur" },
            { id_kecamatan: 7, nm_kecamatan: "Arse" },
            { id_kecamatan: 8, nm_kecamatan: "Batang Angkola" },
            { id_kecamatan: 9, nm_kecamatan: "Batang Toru" },
            { id_kecamatan: 10, nm_kecamatan: "Marancar" },
            { id_kecamatan: 11, nm_kecamatan: "Muara Batang Toru" },
            { id_kecamatan: 12, nm_kecamatan: "Saipar Dolok Hole" },
            { id_kecamatan: 13, nm_kecamatan: "Sayur Matinggi" },
            { id_kecamatan: 14, nm_kecamatan: "Sipirok" },
            { id_kecamatan: 15, nm_kecamatan: "Tano Tombangan Angkola" },
        ],
    });



    await prisma.tbl_desa.createMany({
        data: [
            {
                id_desa: 53,
                nm_desa: "Aek Badak Jae",
                id_kecamatan: 1
            },
            {
                id_desa: 54,
                nm_desa: "Aek Badak Julu",
                id_kecamatan: 1
            },
            {
                id_desa: 55,
                nm_desa: "Aek Libung",
                id_kecamatan: 1
            },
            {
                id_desa: 56,
                nm_desa: "Aek Nabara",
                id_kecamatan: 1
            },
            {
                id_desa: 57,
                nm_desa: "Aek Sabaon",
                id_kecamatan: 1
            },
            {
                id_desa: 58,
                nm_desa: "Aek Siansimun",
                id_kecamatan: 1
            },
            {
                id_desa: 59,
                nm_desa: "Aek Sangkilon",
                id_kecamatan: 1
            },
            {
                id_desa: 60,
                nm_desa: "Aek Suhat",
                id_kecamatan: 1
            },
            {
                id_desa: 61,
                nm_desa: "Pardomuan",
                id_kecamatan: 1
            },
            {
                id_desa: 62,
                nm_desa: "Situmba",
                id_kecamatan: 1
            },
            {
                id_desa: 63,
                nm_desa: "Siondop",
                id_kecamatan: 1
            },
            {
                id_desa: 64,
                nm_desa: "Aek Haruaya",
                id_kecamatan: 1
            },
            {
                id_desa: 65,
                nm_desa: "Siuhom",
                id_kecamatan: 2
            },
            {
                id_desa: 66,
                nm_desa: "Sisundung",
                id_kecamatan: 2
            },
            {
                id_desa: 67,
                nm_desa: "Parsalakan",
                id_kecamatan: 2
            },
            {
                id_desa: 68,
                nm_desa: "Sialogo",
                id_kecamatan: 2
            },
            {
                id_desa: 69,
                nm_desa: "Lembah Lubuk Raya",
                id_kecamatan: 2
            },
            {
                id_desa: 70,
                nm_desa: "Sitara Toit",
                id_kecamatan: 2
            },
            {
                id_desa: 71,
                nm_desa: "Lobu Layan Sigordang",
                id_kecamatan: 2
            },
            {
                id_desa: 72,
                nm_desa: "Aek Nabara",
                id_kecamatan: 2
            },
            {
                id_desa: 73,
                nm_desa: "Sibangkua",
                id_kecamatan: 2
            },
            {
                id_desa: 74,
                nm_desa: "Sigumuru",
                id_kecamatan: 2
            },
            {
                id_desa: 75,
                nm_desa: "Sitinjak",
                id_kecamatan: 2
            },
            {
                id_desa: 76,
                nm_desa: "Simatorkis Sisoma",
                id_kecamatan: 2
            },
            {
                id_desa: 77,
                nm_desa: "Panobasan",
                id_kecamatan: 2
            },
            {
                id_desa: 78,
                nm_desa: "Panobasan Lombang",
                id_kecamatan: 2
            },
            {
                id_desa: 79,
                nm_desa: "Bintuju",
                id_kecamatan: 3
            },
            {
                id_desa: 80,
                nm_desa: "Huta Tonga",
                id_kecamatan: 3
            },
            {
                id_desa: 81,
                nm_desa: "Basilam Baru",
                id_kecamatan: 3
            },
            {
                id_desa: 82,
                nm_desa: "Huta Holbung",
                id_kecamatan: 3
            },
            {
                id_desa: 83,
                nm_desa: "Janji Mauli MT",
                id_kecamatan: 3
            },
            {
                id_desa: 84,
                nm_desa: "Muara Purba Nauli",
                id_kecamatan: 3
            },
            {
                id_desa: 85,
                nm_desa: "Muara Tais I",
                id_kecamatan: 3
            },
            {
                id_desa: 86,
                nm_desa: "Muara Tais II",
                id_kecamatan: 3
            },
            {
                id_desa: 87,
                nm_desa: "Muara Tais III",
                id_kecamatan: 3
            },
            {
                id_desa: 88,
                nm_desa: "Pangaribuan",
                id_kecamatan: 3
            },
            {
                id_desa: 89,
                nm_desa: "Pargumbangan",
                id_kecamatan: 3
            },
            {
                id_desa: 90,
                nm_desa: "Pasir Matogu",
                id_kecamatan: 3
            },
            {
                id_desa: 91,
                nm_desa: "Sipangko",
                id_kecamatan: 3
            },
            {
                id_desa: 92,
                nm_desa: "Sori Manaon",
                id_kecamatan: 3
            },
            {
                id_desa: 93,
                nm_desa: "Tatengger",
                id_kecamatan: 3
            },
            {
                id_desa: 94,
                nm_desa: "Aek Pardomuan",
                id_kecamatan: 4
            },
            {
                id_desa: 95,
                nm_desa: "Bandar Tarutung",
                id_kecamatan: 4
            },
            {
                id_desa: 96,
                nm_desa: "Batu Godang",
                id_kecamatan: 4
            },
            {
                id_desa: 97,
                nm_desa: "Malombu",
                id_kecamatan: 4
            },
            {
                id_desa: 98,
                nm_desa: "Perkebunan",
                id_kecamatan: 4
            },
            {
                id_desa: 99,
                nm_desa: "Simataniari",
                id_kecamatan: 4
            },
            {
                id_desa: 100,
                nm_desa: "Simatohir",
                id_kecamatan: 4
            },
            {
                id_desa: 101,
                nm_desa: "Tindoan Laut",
                id_kecamatan: 4
            },
            {
                id_desa: 102,
                nm_desa: "Napa",
                id_kecamatan: 5
            },
            {
                id_desa: 103,
                nm_desa: "Simarpinggan",
                id_kecamatan: 5
            },
            {
                id_desa: 104,
                nm_desa: "Tapian Nauli",
                id_kecamatan: 5
            },
            {
                id_desa: 105,
                nm_desa: "Pardomuan",
                id_kecamatan: 5
            },
            {
                id_desa: 106,
                nm_desa: "Aek Natas",
                id_kecamatan: 5
            },
            {
                id_desa: 107,
                nm_desa: "Dolok Godang",
                id_kecamatan: 5
            },
            {
                id_desa: 108,
                nm_desa: "Gunung Baringin",
                id_kecamatan: 5
            },
            {
                id_desa: 109,
                nm_desa: "Perk. Marpinggan",
                id_kecamatan: 5
            },
            {
                id_desa: 110,
                nm_desa: "Sihuik Huik",
                id_kecamatan: 5
            },
            {
                id_desa: 111,
                nm_desa: "Sinyior",
                id_kecamatan: 5
            },
            {
                id_desa: 112,
                nm_desa: "Pintu Padang",
                id_kecamatan: 5
            },
            {
                id_desa: 113,
                nm_desa: "Sibongbong",
                id_kecamatan: 5
            },
            {
                id_desa: 114,
                nm_desa: "Situmbaga",
                id_kecamatan: 5
            },
            {
                id_desa: 115,
                nm_desa: "Panompuan Jae",
                id_kecamatan: 6
            },
            {
                id_desa: 116,
                nm_desa: "Pargarutan Tonga",
                id_kecamatan: 6
            },
            {
                id_desa: 117,
                nm_desa: "Huraba",
                id_kecamatan: 6
            },
            {
                id_desa: 118,
                nm_desa: "Huta Ginjang",
                id_kecamatan: 6
            },
            {
                id_desa: 119,
                nm_desa: "Lantosan Rogas",
                id_kecamatan: 6
            },
            {
                id_desa: 120,
                nm_desa: "Marisi",
                id_kecamatan: 6
            },
            {
                id_desa: 121,
                nm_desa: "Pargarutan Jae",
                id_kecamatan: 6
            },
            {
                id_desa: 122,
                nm_desa: "Parg arutan Dolok",
                id_kecamatan: 6
            },
            {
                id_desa: 123,
                nm_desa: "Pal XI",
                id_kecamatan: 6
            },
            {
                id_desa: 124,
                nm_desa: "Sijungkang",
                id_kecamatan: 6
            },
            {
                id_desa: 125,
                nm_desa: "Panompuan",
                id_kecamatan: 6
            },
            {
                id_desa: 126,
                nm_desa: "Pargarutan Julu",
                id_kecamatan: 6
            },
            {
                id_desa: 127,
                nm_desa: "Arse Nauli",
                id_kecamatan: 7
            },
            {
                id_desa: 128,
                nm_desa: "Aek Haminjon",
                id_kecamatan: 7
            },
            {
                id_desa: 129,
                nm_desa: "Dalihan Natolu",
                id_kecamatan: 7
            },
            {
                id_desa: 130,
                nm_desa: "Nanggar Jati",
                id_kecamatan: 7
            },
            {
                id_desa: 131,
                nm_desa: "Nanggar Jati Huta Padang",
                id_kecamatan: 7
            },
            {
                id_desa: 132,
                nm_desa: "Natambang Roncitan",
                id_kecamatan: 7
            },
            {
                id_desa: 133,
                nm_desa: "Lancat",
                id_kecamatan: 7
            },
            {
                id_desa: 134,
                nm_desa: "Pardomuan",
                id_kecamatan: 7
            },
            {
                id_desa: 135,
                nm_desa: "Pinagar",
                id_kecamatan: 7
            },
            {
                id_desa: 136,
                nm_desa: "Sipogu",
                id_kecamatan: 7
            },
            {
                id_desa: 137,
                nm_desa: "Bangun Purba",
                id_kecamatan: 8
            },
            {
                id_desa: 138,
                nm_desa: "Pintu Padang I",
                id_kecamatan: 8
            },
            {
                id_desa: 139,
                nm_desa: "Pintu Padang II",
                id_kecamatan: 8
            },
            {
                id_desa: 140,
                nm_desa: "Sigalangan",
                id_kecamatan: 8
            },
            {
                id_desa: 141,
                nm_desa: "Aek Gunung",
                id_kecamatan: 8
            },
            {
                id_desa: 142,
                nm_desa: "Aek Nauli",
                id_kecamatan: 8
            },
            {
                id_desa: 143,
                nm_desa: "Bargot Topong",
                id_kecamatan: 8
            },
            {
                id_desa: 144,
                nm_desa: "Benteng Huraba",
                id_kecamatan: 8
            },
            {
                id_desa: 145,
                nm_desa: "Hurase",
                id_kecamatan: 8
            },
            {
                id_desa: 146,
                nm_desa: "Huta Padang",
                id_kecamatan: 8
            },
            {
                id_desa: 147,
                nm_desa: "Janji Manaon",
                id_kecamatan: 8
            },
            {
                id_desa: 148,
                nm_desa: "Padang Kahombu",
                id_kecamatan: 8
            },
            {
                id_desa: 149,
                nm_desa: "Pasar Lama",
                id_kecamatan: 8
            },
            {
                id_desa: 150,
                nm_desa: "Sibulele Muara",
                id_kecamatan: 8
            },
            {
                id_desa: 151,
                nm_desa: "Sidadi I",
                id_kecamatan: 8
            },
            {
                id_desa: 152,
                nm_desa: "Sidadi II",
                id_kecamatan: 8
            },
            {
                id_desa: 153,
                nm_desa: "Sigulang Losung",
                id_kecamatan: 8
            },
            {
                id_desa: 154,
                nm_desa: "Sitampa",
                id_kecamatan: 8
            },
            {
                id_desa: 155,
                nm_desa: "Sorik",
                id_kecamatan: 8
            },
            {
                id_desa: 156,
                nm_desa: "Sorimadingin Pintu Padang",
                id_kecamatan: 8
            },
            {
                id_desa: 157,
                nm_desa: "Tahalak Ujung Gading",
                id_kecamatan: 8
            },
            {
                id_desa: 158,
                nm_desa: "Hapesong Lama",
                id_kecamatan: 9
            },
            {
                id_desa: 159,
                nm_desa: "Perk Hapesong",
                id_kecamatan: 9
            },
            {
                id_desa: 160,
                nm_desa: "Padang Lancat",
                id_kecamatan: 9
            },
            {
                id_desa: 161,
                nm_desa: "Sianggunan",
                id_kecamatan: 9
            },
            {
                id_desa: 162,
                nm_desa: "Huta Baru",
                id_kecamatan: 9
            },
            {
                id_desa: 163,
                nm_desa: "Hapesong Baru",
                id_kecamatan: 9
            },
            {
                id_desa: 164,
                nm_desa: "Perkebunan Sigala-Gala",
                id_kecamatan: 9
            },
            {
                id_desa: 165,
                nm_desa: "Perk Batang Toru",
                id_kecamatan: 9
            },
            {
                id_desa: 166,
                nm_desa: "Telo",
                id_kecamatan: 9
            },
            {
                id_desa: 167,
                nm_desa: "Wek III Batang Toru",
                id_kecamatan: 9
            },
            {
                id_desa: 168,
                nm_desa: "Wek II Batang Toru",
                id_kecamatan: 9
            },
            {
                id_desa: 169,
                nm_desa: "Wek I Batang Toru",
                id_kecamatan: 9
            },
            {
                id_desa: 170,
                nm_desa: "Wek IV Batang Toru",
                id_kecamatan: 9
            },
            {
                id_desa: 171,
                nm_desa: "Napa",
                id_kecamatan: 9
            },
            {
                id_desa: 172,
                nm_desa: "Aek Pining",
                id_kecamatan: 9
            },
            {
                id_desa: 173,
                nm_desa: "Sumuran",
                id_kecamatan: 9
            },
            {
                id_desa: 174,
                nm_desa: "Batu Hula",
                id_kecamatan: 9
            },
            {
                id_desa: 175,
                nm_desa: "Huta Godang",
                id_kecamatan: 9
            },
            {
                id_desa: 176,
                nm_desa: "Garoga",
                id_kecamatan: 9
            },
            {
                id_desa: 177,
                nm_desa: "Batu Horing",
                id_kecamatan: 9
            },
            {
                id_desa: 178,
                nm_desa: "Aek Ngadol Nauli",
                id_kecamatan: 9
            },
            {
                id_desa: 179,
                nm_desa: "Sisipa",
                id_kecamatan: 9
            },
            {
                id_desa: 180,
                nm_desa: "Aek Nabara",
                id_kecamatan: 10
            },
            {
                id_desa: 181,
                nm_desa: "Aek Sabaon",
                id_kecamatan: 10
            },
            {
                id_desa: 182,
                nm_desa: "Gapuk Tua",
                id_kecamatan: 10
            },
            {
                id_desa: 183,
                nm_desa: "Haunatas",
                id_kecamatan: 10
            },
            {
                id_desa: 184,
                nm_desa: "Huraba",
                id_kecamatan: 10
            },
            {
                id_desa: 185,
                nm_desa: "Marancar Godang",
                id_kecamatan: 10
            },
            {
                id_desa: 186,
                nm_desa: "Marancar Julu",
                id_kecamatan: 10
            },
            {
                id_desa: 187,
                nm_desa: "Mombang Boru",
                id_kecamatan: 10
            },
            {
                id_desa: 188,
                nm_desa: "Simaninggir",
                id_kecamatan: 10
            },
            {
                id_desa: 189,
                nm_desa: "Sugi",
                id_kecamatan: 10
            },
            {
                id_desa: 190,
                nm_desa: "Tanjung Dolok",
                id_kecamatan: 10
            },
            {
                id_desa: 191,
                nm_desa: "Pasar Sempurna",
                id_kecamatan: 10
            },
            {
                id_desa: 192,
                nm_desa: "Bandar Hapinis",
                id_kecamatan: 11
            },
            {
                id_desa: 193,
                nm_desa: "Huta Raja",
                id_kecamatan: 11
            },
            {
                id_desa: 194,
                nm_desa: "Muara Ampolu",
                id_kecamatan: 11
            },
            {
                id_desa: 195,
                nm_desa: "Muara Manompas",
                id_kecamatan: 11
            },
            {
                id_desa: 196,
                nm_desa: "Muara Upu",
                id_kecamatan: 11
            },
            {
                id_desa: 197,
                nm_desa: "Pardamean",
                id_kecamatan: 11
            },
            {
                id_desa: 198,
                nm_desa: "Tarapung Raya",
                id_kecamatan: 11
            },
            {
                id_desa: 199,
                nm_desa: "Sumuran",
                id_kecamatan: 11
            },
            {
                id_desa: 200,
                nm_desa: "Aek Pining",
                id_kecamatan: 11
            },
            {
                id_desa: 201,
                nm_desa: "Aek Simotung",
                id_kecamatan: 12
            },
            {
                id_desa: 202,
                nm_desa: "Sipagimbar",
                id_kecamatan: 12
            },
            {
                id_desa: 203,
                nm_desa: "Batang Parsuluman",
                id_kecamatan: 12
            },
            {
                id_desa: 204,
                nm_desa: "Damparan Haunatas",
                id_kecamatan: 12
            },
            {
                id_desa: 205,
                nm_desa: "Padang Mandailing Garugur",
                id_kecamatan: 12
            },
            {
                id_desa: 206,
                nm_desa: "Parau Sorat Sitabo-Tabo",
                id_kecamatan: 12
            },
            {
                id_desa: 207,
                nm_desa: "Pintu Padang Mandalasena",
                id_kecamatan: 12
            },
            {
                id_desa: 208,
                nm_desa: "Saut Banua Simanosor",
                id_kecamatan: 12
            },
            {
                id_desa: 209,
                nm_desa: "Sidapdap Simanosor",
                id_kecamatan: 12
            },
            {
                id_desa: 210,
                nm_desa: "Silangkitang Tambiski",
                id_kecamatan: 12
            },
            {
                id_desa: 211,
                nm_desa: "Simangambat",
                id_kecamatan: 12
            },
            {
                id_desa: 212,
                nm_desa: "Somba Debata Purba",
                id_kecamatan: 12
            },
            {
                id_desa: 213,
                nm_desa: "Sunge Sigiring-Giring",
                id_kecamatan: 12
            },
            {
                id_desa: 214,
                nm_desa: "Ulu Mamis Situnggaling",
                id_kecamatan: 12
            },
            {
                id_desa: 215,
                nm_desa: "Sayur Matinggi",
                id_kecamatan: 13
            },
            {
                id_desa: 216,
                nm_desa: "Aek Badak Jae",
                id_kecamatan: 13
            },
            {
                id_desa: 217,
                nm_desa: "Aek Badak Julu",
                id_kecamatan: 13
            },
            {
                id_desa: 218,
                nm_desa: "Aek Libung",
                id_kecamatan: 13
            },
            {
                id_desa: 219,
                nm_desa: "Bange",
                id_kecamatan: 13
            },
            {
                id_desa: 220,
                nm_desa: "Bulu Gading",
                id_kecamatan: 13
            },
            {
                id_desa: 221,
                nm_desa: "Huta Pardomuan",
                id_kecamatan: 13
            },
            {
                id_desa: 222,
                nm_desa: "Janji Mauli Baringin",
                id_kecamatan: 13
            },
            {
                id_desa: 223,
                nm_desa: "Lumban Huayan",
                id_kecamatan: 13
            },
            {
                id_desa: 224,
                nm_desa: "Mondang",
                id_kecamatan: 13
            },
            {
                id_desa: 225,
                nm_desa: "Sialang",
                id_kecamatan: 13
            },
            {
                id_desa: 226,
                nm_desa: "Silaiya",
                id_kecamatan: 13
            },
            {
                id_desa: 227,
                nm_desa: "Silaiya Tanjung Leuk",
                id_kecamatan: 13
            },
            {
                id_desa: 228,
                nm_desa: "Sipange Godang",
                id_kecamatan: 13
            },
            {
                id_desa: 229,
                nm_desa: "Sipange Julu",
                id_kecamatan: 13
            },
            {
                id_desa: 230,
                nm_desa: "Sipange Leuk",
                id_kecamatan: 13
            },
            {
                id_desa: 231,
                nm_desa: "Somanggal Parmonangan",
                id_kecamatan: 13
            },
            {
                id_desa: 232,
                nm_desa: "Tolang Jae",
                id_kecamatan: 13
            },
            {
                id_desa: 233,
                nm_desa: "Tolang Julu",
                id_kecamatan: 13
            },
            {
                id_desa: 234,
                nm_desa: "Tolang",
                id_kecamatan: 14
            },
            {
                id_desa: 235,
                nm_desa: "Janji Mauli",
                id_kecamatan: 14
            },
            {
                id_desa: 236,
                nm_desa: "Baringin",
                id_kecamatan: 14
            },
            {
                id_desa: 237,
                nm_desa: "Parau Sorat",
                id_kecamatan: 14
            },
            {
                id_desa: 238,
                nm_desa: "Siala Gundi",
                id_kecamatan: 14
            },
            {
                id_desa: 239,
                nm_desa: "Barnang Koling",
                id_kecamatan: 14
            },
            {
                id_desa: 240,
                nm_desa: "Pargarutan",
                id_kecamatan: 14
            },
            {
                id_desa: 241,
                nm_desa: "Panaungan",
                id_kecamatan: 14
            },
            {
                id_desa: 242,
                nm_desa: "Pangaribuan",
                id_kecamatan: 14
            },
            {
                id_desa: 243,
                nm_desa: "Padang Bujur",
                id_kecamatan: 14
            },
            {
                id_desa: 244,
                nm_desa: "Simaninggir",
                id_kecamatan: 14
            },
            {
                id_desa: 245,
                nm_desa: "Paran Padang",
                id_kecamatan: 14
            },
            {
                id_desa: 246,
                nm_desa: "Pasar Sipirok",
                id_kecamatan: 14
            },
            {
                id_desa: 247,
                nm_desa: "Pangurabaan",
                id_kecamatan: 14
            },
            {
                id_desa: 248,
                nm_desa: "Bagas Lombang",
                id_kecamatan: 14
            },
            {
                id_desa: 249,
                nm_desa: "Paran Julu",
                id_kecamatan: 14
            },
            {
                id_desa: 250,
                nm_desa: "Bulu Mario",
                id_kecamatan: 14
            },
            {
                id_desa: 251,
                nm_desa: "Batu Satail",
                id_kecamatan: 14
            },
            {
                id_desa: 252,
                nm_desa: "Ramba Sihasur",
                id_kecamatan: 14
            },
            {
                id_desa: 253,
                nm_desa: "Sibadoar",
                id_kecamatan: 14
            },
            {
                id_desa: 254,
                nm_desa: "Hasang Marsada",
                id_kecamatan: 14
            },
            {
                id_desa: 255,
                nm_desa: "Bunga Bondar",
                id_kecamatan: 14
            },
            {
                id_desa: 256,
                nm_desa: "Sampean",
                id_kecamatan: 14
            },
            {
                id_desa: 257,
                nm_desa: "Sialaman",
                id_kecamatan: 14
            },
            {
                id_desa: 258,
                nm_desa: "Kilang Papan",
                id_kecamatan: 14
            },
            {
                id_desa: 259,
                nm_desa: "Saba Batang Miha",
                id_kecamatan: 14
            },
            {
                id_desa: 260,
                nm_desa: "Situmba",
                id_kecamatan: 14
            },
            {
                id_desa: 261,
                nm_desa: "Situmba Julu",
                id_kecamatan: 14
            },
            {
                id_desa: 262,
                nm_desa: "Batang Tura Julu",
                id_kecamatan: 14
            },
            {
                id_desa: 263,
                nm_desa: "Batang Tura",
                id_kecamatan: 14
            },
            {
                id_desa: 264,
                nm_desa: "Paran Dolok Mardomu",
                id_kecamatan: 14
            },
            {
                id_desa: 265,
                nm_desa: "Sarogodung",
                id_kecamatan: 14
            },
            {
                id_desa: 266,
                nm_desa: "Dolok Sordang",
                id_kecamatan: 14
            },
            {
                id_desa: 267,
                nm_desa: "Dolok Sordang Julu",
                id_kecamatan: 14
            },
            {
                id_desa: 268,
                nm_desa: "Huta Suhut",
                id_kecamatan: 14
            },
            {
                id_desa: 269,
                nm_desa: "Sipirok Godang",
                id_kecamatan: 14
            },
            {
                id_desa: 270,
                nm_desa: "Aek Batang Paya",
                id_kecamatan: 14
            },
            {
                id_desa: 271,
                nm_desa: "Marsada",
                id_kecamatan: 14
            },
            {
                id_desa: 272,
                nm_desa: "Luat Lombang",
                id_kecamatan: 14
            },
            {
                id_desa: 273,
                nm_desa: "Pahae Aek Sagala",
                id_kecamatan: 14
            },
            {
                id_desa: 274,
                nm_desa: "Simaninggir",
                id_kecamatan: 15
            },
            {
                id_desa: 275,
                nm_desa: "kota Tua",
                id_kecamatan: 15
            },
            {
                id_desa: 276,
                nm_desa: "Harean",
                id_kecamatan: 15
            },
            {
                id_desa: 277,
                nm_desa: "Lumban Ratus",
                id_kecamatan: 15
            },
            {
                id_desa: 278,
                nm_desa: "Sisoma",
                id_kecamatan: 15
            },
            {
                id_desa: 279,
                nm_desa: "Ingul Jae",
                id_kecamatan: 15
            },
            {
                id_desa: 280,
                nm_desa: "Lumban Jabi-Jabi",
                id_kecamatan: 15
            },
            {
                id_desa: 281,
                nm_desa: "Purbatua",
                id_kecamatan: 15
            },
            {
                id_desa: 282,
                nm_desa: "Hutaraja",
                id_kecamatan: 15
            },
            {
                id_desa: 283,
                nm_desa: "Panabari Huta Tonga",
                id_kecamatan: 15
            },
            {
                id_desa: 284,
                nm_desa: "Situmbe",
                id_kecamatan: 15
            },
            {
                id_desa: 285,
                nm_desa: "Batu Horpak",
                id_kecamatan: 15
            },
            {
                id_desa: 286,
                nm_desa: "Aek Kahombu",
                id_kecamatan: 15
            },
            {
                id_desa: 287,
                nm_desa: "Tanjung Medan",
                id_kecamatan: 15
            },
            {
                id_desa: 288,
                nm_desa: "Aek Parupuk",
                id_kecamatan: 15
            },
            {
                id_desa: 289,
                nm_desa: "Panindoan",
                id_kecamatan: 15
            },
            {
                id_desa: 290,
                nm_desa: "Aek Uncim",
                id_kecamatan: 15
            }
        ],
    });

}



main()
    .then(() => {
        console.log("✅ Seeding selesai!");
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
