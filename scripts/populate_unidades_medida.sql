-- Script para poblar unidades de medida
INSERT INTO unidad_medida (desc_unidad_medida, abreviatura, created_at) VALUES
('Gramos', 'g', NOW()),
('Kilogramos', 'kg', NOW()),
('Mililitros', 'ml', NOW()),
('Litros', 'L', NOW()),
('Unidades', 'unid', NOW()),
('Tazas', 'taza', NOW()),
('Cucharadas', 'cdas', NOW()),
('Cucharaditas', 'cdtas', NOW()),
('Porciones', 'porc', NOW());

SELECT * FROM unidad_medida ORDER BY id_unidad_medida;
