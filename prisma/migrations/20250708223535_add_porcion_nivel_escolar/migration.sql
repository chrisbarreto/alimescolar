-- CreateTable
CREATE TABLE "porcion_nivel_escolar" (
    "id_porcion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_plato" UUID NOT NULL,
    "nivel_escolar" VARCHAR(50) NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "id_unidad_medida" UUID NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "porcion_nivel_escolar_pkey" PRIMARY KEY ("id_porcion")
);

-- CreateIndex
CREATE UNIQUE INDEX "porcion_nivel_escolar_id_plato_nivel_escolar_key" ON "porcion_nivel_escolar"("id_plato", "nivel_escolar");

-- AddForeignKey
ALTER TABLE "porcion_nivel_escolar" ADD CONSTRAINT "porcion_nivel_escolar_id_plato_fkey" FOREIGN KEY ("id_plato") REFERENCES "plato"("id_plato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "porcion_nivel_escolar" ADD CONSTRAINT "porcion_nivel_escolar_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "unidad_medida"("id_unidad_medida") ON DELETE NO ACTION ON UPDATE NO ACTION;
