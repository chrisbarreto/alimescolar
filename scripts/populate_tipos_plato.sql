-- Script para poblar tipos de plato
INSERT INTO tipo_plato (nombre, descripcion, orden, created_at) VALUES
('Desayuno', 'Comida principal del inicio del día', 1, NOW()),
('Almuerzo', 'Comida principal del mediodía', 2, NOW()),
('Merienda', 'Refrigerio ligero entre comidas', 3, NOW()),
('Cena', 'Comida principal de la noche', 4, NOW()),
('Refrigerio', 'Snack o bebida complementaria', 5, NOW()),
('Postre', 'Dulce o fruta para finalizar la comida', 6, NOW())
ON CONFLICT (orden) DO NOTHING;

SELECT * FROM tipo_plato ORDER BY orden;
