-- AlterTable
ALTER TABLE "stocks_in" ADD COLUMN     "description" TEXT DEFAULT E'Pemasukan stok oleh admin';

-- AlterTable
ALTER TABLE "stocks_out" ADD COLUMN     "description" TEXT DEFAULT E'Pengeluaran stok atas permintaan unit';
