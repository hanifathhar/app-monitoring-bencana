-- CreateTable
CREATE TABLE "PoskoKejadian" (
    "id" SERIAL NOT NULL,
    "id_posko" INTEGER NOT NULL,
    "id_kejadian" INTEGER NOT NULL,

    CONSTRAINT "PoskoKejadian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PoskoKejadian" ADD CONSTRAINT "PoskoKejadian_id_posko_fkey" FOREIGN KEY ("id_posko") REFERENCES "tbl_posko"("id_posko") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoskoKejadian" ADD CONSTRAINT "PoskoKejadian_id_kejadian_fkey" FOREIGN KEY ("id_kejadian") REFERENCES "tbl_kejadian"("id_kejadian") ON DELETE RESTRICT ON UPDATE CASCADE;
