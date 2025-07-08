/*
  Warnings:

  - You are about to drop the column `nivel_escolar` on the `porcion_nivel_escolar` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_plato,id_nivel_escolar]` on the table `porcion_nivel_escolar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_nivel_escolar` to the `porcion_nivel_escolar` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "porcion_nivel_escolar_id_plato_nivel_escolar_key";

-- AlterTable
ALTER TABLE "porcion_nivel_escolar" DROP COLUMN "nivel_escolar",
ADD COLUMN     "id_nivel_escolar" UUID NOT NULL;

-- CreateTable
CREATE TABLE "nivel_escolar" (
    "id_nivel_escolar" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "edad_minima" INTEGER,
    "edad_maxima" INTEGER,
    "orden" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nivel_escolar_pkey" PRIMARY KEY ("id_nivel_escolar")
);

-- CreateIndex
CREATE UNIQUE INDEX "nivel_escolar_nombre_key" ON "nivel_escolar"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "nivel_escolar_orden_key" ON "nivel_escolar"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "porcion_nivel_escolar_id_plato_id_nivel_escolar_key" ON "porcion_nivel_escolar"("id_plato", "id_nivel_escolar");

-- AddForeignKey
ALTER TABLE "porcion_nivel_escolar" ADD CONSTRAINT "porcion_nivel_escolar_id_nivel_escolar_fkey" FOREIGN KEY ("id_nivel_escolar") REFERENCES "nivel_escolar"("id_nivel_escolar") ON DELETE NO ACTION ON UPDATE NO ACTION;
