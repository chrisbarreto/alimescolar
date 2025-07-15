-- Script SQL para poblar datos básicos rápidamente
-- Ejecutar en la consola de Supabase

-- 1. Tipos de documento
INSERT INTO tipo_documento (desc_tipo_documento) VALUES
('Cédula de Identidad'),
('Pasaporte'),
('RUC'),
('Otro')
ON CONFLICT DO NOTHING;

-- 2. Ciudades básicas
INSERT INTO ciudad (nombre_ciudad) VALUES
('Asunción'),
('Ciudad del Este'),
('San Lorenzo'),
('Luque'),
('Capiatá')
ON CONFLICT DO NOTHING;

-- 3. Tipos de plato
INSERT INTO tipo_plato (nombre, descripcion, orden) VALUES
('Almuerzo', 'Comida principal del mediodía', 1),
('Ensalada', 'Acompañamiento de verduras', 2),
('Postre', 'Dulce para finalizar la comida', 3),
('Desayuno', 'Comida principal del inicio del día', 4),
('Merienda', 'Refrigerio ligero', 5)
ON CONFLICT (orden) DO NOTHING;

-- 4. Niveles escolares
INSERT INTO nivel_escolar (nombre, descripcion, orden) VALUES
('Inicial', 'Educación Inicial', 1),
('Primer y Segundo Ciclo', 'Primer y Segundo Ciclo', 2),
('Tercer Ciclo', 'Tercer Ciclo', 3)
ON CONFLICT (nombre) DO NOTHING;

-- 5. Unidades de medida básicas
INSERT INTO unidad_medida (desc_unidad_medida, abreviatura) VALUES
('Gramos', 'g'),
('Kilogramos', 'kg'),
('Litros', 'L'),
('Mililitros', 'ml'),
('Unidades', 'u')
ON CONFLICT DO NOTHING;
