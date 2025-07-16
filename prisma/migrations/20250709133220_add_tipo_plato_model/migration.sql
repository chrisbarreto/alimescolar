/*
  Warnings:

  - You are about to drop the column `energia_kcal` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `id_organizacion` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `observaciones` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `peso_por_porcion` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `preparacion` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `rendimiento` on the `plato` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `plato` table. All the data in the column will be lost.
  - Added the required column `id_escuela` to the `plato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tipo_plato` to the `plato` table without a default value. This is not possible if the table is not empty.

*/

-- Crear tabla tipo_plato primero
CREATE TABLE "tipo_plato" (
    "id_tipo_plato" INTEGER NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "orden" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipo_plato_pkey" PRIMARY KEY ("id_tipo_plato")
);

-- Crear índice único para orden
CREATE UNIQUE INDEX "tipo_plato_orden_key" ON "tipo_plato"("orden");

-- Insertar tipos de plato básicos
INSERT INTO "tipo_plato" ("id_tipo_plato", "nombre", "descripcion", "orden", "activo") VALUES
(1, 'Almuerzo', 'Plato principal del almuerzo', 1, true),
(2, 'Ensalada', 'Ensalada como acompañamiento', 2, true),
(3, 'Postre', 'Postre para finalizar la comida', 3, true);

-- Obtener la primera escuela disponible para asignar platos existentes
DO $$
DECLARE
    primera_escuela_id UUID;
BEGIN
    -- Buscar la primera escuela disponible
    SELECT "id_escuela" INTO primera_escuela_id FROM "escuela" LIMIT 1;
    
    -- Si no hay escuelas, no podemos proceder
    IF primera_escuela_id IS NULL THEN
        RAISE EXCEPTION 'No hay escuelas disponibles. Primero debe crear una escuela.';
    END IF;
    
    -- Agregar columnas temporales con valores por defecto
    ALTER TABLE "plato" 
    ADD COLUMN "id_escuela_temp" UUID DEFAULT primera_escuela_id,
    ADD COLUMN "id_tipo_plato_temp" INTEGER DEFAULT 1;
    
    -- Actualizar los valores basados en el tipo anterior
    UPDATE "plato" 
    SET "id_tipo_plato_temp" = CASE 
        WHEN "tipo" ILIKE '%ensalada%' THEN 2
        WHEN "tipo" ILIKE '%postre%' THEN 3
        ELSE 1
    END;
    
    -- Actualizar escuela basada en organización si es posible
    UPDATE "plato" 
    SET "id_escuela_temp" = e."id_escuela"
    FROM "escuela" e 
    WHERE e."id_organizacion" = "plato"."id_organizacion";
    
END $$;

-- Ahora modificar la tabla
-- DropForeignKey
ALTER TABLE "plato" DROP CONSTRAINT "plato_id_organizacion_fkey";

-- AlterTable - Eliminar columnas antiguas
ALTER TABLE "plato" 
DROP COLUMN "energia_kcal",
DROP COLUMN "id_organizacion",
DROP COLUMN "observaciones",
DROP COLUMN "peso_por_porcion",
DROP COLUMN "preparacion",
DROP COLUMN "rendimiento",
DROP COLUMN "tipo";

-- Agregar nuevas columnas y renombrar las temporales
ALTER TABLE "plato" 
ADD COLUMN "es_ejemplo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "updated_at" TIMESTAMP(6),
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255);

-- Renombrar columnas temporales a finales
ALTER TABLE "plato" 
RENAME COLUMN "id_escuela_temp" TO "id_escuela";
ALTER TABLE "plato" 
RENAME COLUMN "id_tipo_plato_temp" TO "id_tipo_plato";

-- Hacer los campos NOT NULL
ALTER TABLE "plato" ALTER COLUMN "id_escuela" SET NOT NULL;
ALTER TABLE "plato" ALTER COLUMN "id_tipo_plato" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "plato" ADD CONSTRAINT "plato_id_tipo_plato_fkey" FOREIGN KEY ("id_tipo_plato") REFERENCES "tipo_plato"("id_tipo_plato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plato" ADD CONSTRAINT "plato_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id_escuela") ON DELETE RESTRICT ON UPDATE CASCADE;
