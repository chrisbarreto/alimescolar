-- SQL para poblar la tabla tipo_insumo
-- Ejecutar en Supabase o directamente en la base de datos PostgreSQL

INSERT INTO tipo_insumo (desc_tipo_insumo, created_at) VALUES
-- Proteínas
('Carnes', NOW()),
('Pollo', NOW()),
('Pescados y Mariscos', NOW()),
('Huevos', NOW()),
('Legumbres y Granos', NOW()),

-- Lácteos
('Lácteos', NOW()),
('Quesos', NOW()),

-- Vegetales y Frutas
('Verduras y Hortalizas', NOW()),
('Frutas', NOW()),

-- Carbohidratos
('Cereales y Granos', NOW()),
('Harinas', NOW()),
('Pastas', NOW()),
('Panes', NOW()),

-- Condimentos y Especias
('Condimentos y Especias', NOW()),
('Aceites y Grasas', NOW()),
('Aderezos y Salsas', NOW()),

-- Bebidas
('Bebidas', NOW()),

-- Otros
('Enlatados y Conservas', NOW()),
('Productos de Panadería', NOW()),
('Snacks y Aperitivos', NOW()),
('Productos Congelados', NOW()),
('Productos Secos', NOW()),
('Aditivos Alimentarios', NOW());

-- Verificar la inserción
SELECT * FROM tipo_insumo ORDER BY id_tipo_insumo;
