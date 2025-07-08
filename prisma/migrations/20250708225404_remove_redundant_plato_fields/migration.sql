/*
  Warnings:

  - You are about to drop the column `adolescentes` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `edad_escolar` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `nivel_inicial` on the `plato` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "plato" DROP COLUMN "adolescentes",
DROP COLUMN "edad_escolar",
DROP COLUMN "nivel_inicial";
