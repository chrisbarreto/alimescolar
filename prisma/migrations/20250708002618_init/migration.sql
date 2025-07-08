-- CreateTable
CREATE TABLE "ciudad" (
    "id_ciudad" INTEGER NOT NULL,
    "nombre_ciudad" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ciudad_pkey" PRIMARY KEY ("id_ciudad")
);

-- CreateTable
CREATE TABLE "escuela" (
    "id_escuela" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(200) NOT NULL,
    "direccion" VARCHAR(255),
    "id_ciudad" INTEGER,
    "id_organizacion" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escuela_pkey" PRIMARY KEY ("id_escuela")
);

-- CreateTable
CREATE TABLE "escuela_encargado" (
    "id_escuela" UUID NOT NULL,
    "id_persona" UUID NOT NULL,
    "cargo" VARCHAR(100) DEFAULT 'Director',
    "fecha_desde" DATE DEFAULT CURRENT_DATE,
    "fecha_hasta" DATE,
    "observaciones" TEXT,

    CONSTRAINT "escuela_encargado_pkey" PRIMARY KEY ("id_escuela","id_persona")
);

-- CreateTable
CREATE TABLE "insumo" (
    "id_insumo" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_organizacion" UUID NOT NULL,
    "nombre_insumo" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),
    "id_tipo_insumo" UUID NOT NULL,
    "id_unidad_medida" UUID NOT NULL,
    "codigo_barra" VARCHAR(20),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "insumo_pkey" PRIMARY KEY ("id_insumo")
);

-- CreateTable
CREATE TABLE "menu_dia" (
    "id_menu_dia" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_menu_semanal" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "cantidad_raciones" INTEGER NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_dia_pkey" PRIMARY KEY ("id_menu_dia")
);

-- CreateTable
CREATE TABLE "menu_dia_plato" (
    "id_menu_dia" UUID NOT NULL,
    "id_plato" UUID NOT NULL,
    "orden" INTEGER DEFAULT 1,

    CONSTRAINT "menu_dia_plato_pkey" PRIMARY KEY ("id_menu_dia","id_plato")
);

-- CreateTable
CREATE TABLE "menu_semanal" (
    "id_menu_semanal" UUID NOT NULL DEFAULT gen_random_uuid(),
    "semana" DATE NOT NULL,
    "id_escuela" UUID NOT NULL,
    "id_organizacion" UUID NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_semanal_pkey" PRIMARY KEY ("id_menu_semanal")
);

-- CreateTable
CREATE TABLE "orden_compra" (
    "id_orden_compra" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_menu_semanal" UUID,
    "id_escuela" UUID NOT NULL,
    "fecha_orden" DATE NOT NULL,
    "estado" VARCHAR(50) DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orden_compra_pkey" PRIMARY KEY ("id_orden_compra")
);

-- CreateTable
CREATE TABLE "orden_compra_detalle" (
    "id_orden_compra" UUID NOT NULL,
    "id_insumo" UUID NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "id_unidad_medida" UUID NOT NULL,
    "precio_unitario" DECIMAL(12,2),
    "observaciones" TEXT,

    CONSTRAINT "orden_compra_detalle_pkey" PRIMARY KEY ("id_orden_compra","id_insumo")
);

-- CreateTable
CREATE TABLE "organizaciones" (
    "id_organizacion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "razon_social" VARCHAR(255) NOT NULL,
    "ruc" VARCHAR(20) NOT NULL,
    "direccion" VARCHAR(255),
    "correo" VARCHAR(255),
    "telefono" VARCHAR(30),
    "id_ciudad" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "organizaciones_pkey" PRIMARY KEY ("id_organizacion")
);

-- CreateTable
CREATE TABLE "persona" (
    "id_persona" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nro_documento" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "fecha_nacimiento" DATE,
    "direccion" VARCHAR(255),
    "nro_telefono" VARCHAR(30),
    "correo_persona" VARCHAR(255) NOT NULL,
    "id_ciudad" INTEGER,
    "id_tipo_documento" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id_persona")
);

-- CreateTable
CREATE TABLE "plato" (
    "id_plato" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "tipo" VARCHAR(50),
    "id_organizacion" UUID NOT NULL,
    "preparacion" TEXT,
    "energia_kcal" INTEGER,
    "peso_por_porcion" DECIMAL(10,2),
    "rendimiento" INTEGER,
    "observaciones" TEXT,
    "nivel_inicial" DECIMAL(10,2),
    "edad_escolar" DECIMAL(10,2),
    "adolescentes" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plato_pkey" PRIMARY KEY ("id_plato")
);

-- CreateTable
CREATE TABLE "receta_plato" (
    "id_plato" UUID NOT NULL,
    "id_insumo" UUID NOT NULL,
    "cantidad_por_racion" DECIMAL(10,3) NOT NULL,
    "id_unidad_medida" UUID NOT NULL,
    "peso_bruto" DECIMAL(10,3),
    "peso_neto" DECIMAL(10,3),

    CONSTRAINT "receta_plato_pkey" PRIMARY KEY ("id_plato","id_insumo")
);

-- CreateTable
CREATE TABLE "tipo_documento" (
    "id_tipo_documento" INTEGER NOT NULL,
    "desc_tipo_documento" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipo_documento_pkey" PRIMARY KEY ("id_tipo_documento")
);

-- CreateTable
CREATE TABLE "tipo_insumo" (
    "id_tipo_insumo" UUID NOT NULL DEFAULT gen_random_uuid(),
    "desc_tipo_insumo" VARCHAR(100) NOT NULL,

    CONSTRAINT "tipo_insumo_pkey" PRIMARY KEY ("id_tipo_insumo")
);

-- CreateTable
CREATE TABLE "unidad_medida" (
    "id_unidad_medida" UUID NOT NULL DEFAULT gen_random_uuid(),
    "desc_unidad_medida" VARCHAR(250) NOT NULL,
    "abreviatura" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "unidad_medida_pkey" PRIMARY KEY ("id_unidad_medida")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre_usuario" VARCHAR(50) NOT NULL,
    "id_persona" UUID NOT NULL,
    "id_organizacion" UUID NOT NULL,
    "estado_usuario" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "auth_user" (
    "id_auth_user" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id_auth_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "insumo_codigo_barra_key" ON "insumo"("codigo_barra");

-- CreateIndex
CREATE UNIQUE INDEX "organizaciones_ruc_key" ON "organizaciones"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "persona_nro_documento_key" ON "persona"("nro_documento");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "auth_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_usuario_key" ON "auth_user"("id_usuario");

-- AddForeignKey
ALTER TABLE "escuela" ADD CONSTRAINT "escuela_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudad"("id_ciudad") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escuela" ADD CONSTRAINT "escuela_id_organizacion_fkey" FOREIGN KEY ("id_organizacion") REFERENCES "organizaciones"("id_organizacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escuela_encargado" ADD CONSTRAINT "escuela_encargado_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id_escuela") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escuela_encargado" ADD CONSTRAINT "escuela_encargado_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "insumo" ADD CONSTRAINT "insumo_id_organizacion_fkey" FOREIGN KEY ("id_organizacion") REFERENCES "organizaciones"("id_organizacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "insumo" ADD CONSTRAINT "insumo_id_tipo_insumo_fkey" FOREIGN KEY ("id_tipo_insumo") REFERENCES "tipo_insumo"("id_tipo_insumo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "insumo" ADD CONSTRAINT "insumo_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "unidad_medida"("id_unidad_medida") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menu_dia" ADD CONSTRAINT "menu_dia_id_menu_semanal_fkey" FOREIGN KEY ("id_menu_semanal") REFERENCES "menu_semanal"("id_menu_semanal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menu_dia_plato" ADD CONSTRAINT "menu_dia_plato_id_menu_dia_fkey" FOREIGN KEY ("id_menu_dia") REFERENCES "menu_dia"("id_menu_dia") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menu_dia_plato" ADD CONSTRAINT "menu_dia_plato_id_plato_fkey" FOREIGN KEY ("id_plato") REFERENCES "plato"("id_plato") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menu_semanal" ADD CONSTRAINT "menu_semanal_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id_escuela") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menu_semanal" ADD CONSTRAINT "menu_semanal_id_organizacion_fkey" FOREIGN KEY ("id_organizacion") REFERENCES "organizaciones"("id_organizacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_compra" ADD CONSTRAINT "orden_compra_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id_escuela") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_compra" ADD CONSTRAINT "orden_compra_id_menu_semanal_fkey" FOREIGN KEY ("id_menu_semanal") REFERENCES "menu_semanal"("id_menu_semanal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_compra_detalle" ADD CONSTRAINT "orden_compra_detalle_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "insumo"("id_insumo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_compra_detalle" ADD CONSTRAINT "orden_compra_detalle_id_orden_compra_fkey" FOREIGN KEY ("id_orden_compra") REFERENCES "orden_compra"("id_orden_compra") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_compra_detalle" ADD CONSTRAINT "orden_compra_detalle_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "unidad_medida"("id_unidad_medida") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizaciones" ADD CONSTRAINT "organizaciones_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudad"("id_ciudad") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "persona" ADD CONSTRAINT "persona_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudad"("id_ciudad") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "persona" ADD CONSTRAINT "persona_id_tipo_documento_fkey" FOREIGN KEY ("id_tipo_documento") REFERENCES "tipo_documento"("id_tipo_documento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plato" ADD CONSTRAINT "plato_id_organizacion_fkey" FOREIGN KEY ("id_organizacion") REFERENCES "organizaciones"("id_organizacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receta_plato" ADD CONSTRAINT "receta_plato_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "insumo"("id_insumo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receta_plato" ADD CONSTRAINT "receta_plato_id_plato_fkey" FOREIGN KEY ("id_plato") REFERENCES "plato"("id_plato") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receta_plato" ADD CONSTRAINT "receta_plato_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "unidad_medida"("id_unidad_medida") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_organizacion_fkey" FOREIGN KEY ("id_organizacion") REFERENCES "organizaciones"("id_organizacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_user" ADD CONSTRAINT "auth_user_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
