-- Script completo para poblar todas las tablas de catálogos
-- Ejecutar este script en la base de datos

-- 1. Ciudades
INSERT INTO ciudad (nombre_ciudad, created_at) VALUES
('Bogotá', NOW()),
('Medellín', NOW()),
('Cali', NOW()),
('Barranquilla', NOW()),
('Cartagena', NOW()),
('Cúcuta', NOW()),
('Bucaramanga', NOW()),
('Pereira', NOW()),
('Ibagué', NOW()),
('Santa Marta', NOW()),
('Villavicencio', NOW()),
('Manizales', NOW()),
('Neiva', NOW()),
('Pasto', NOW()),
('Armenia', NOW()),
('Montería', NOW()),
('Valledupar', NOW()),
('Popayán', NOW()),
('Sincelejo', NOW()),
('Tunja', NOW());

-- 2. Niveles Escolares
INSERT INTO nivel_escolar (nombre, descripcion, orden, created_at) VALUES
('INICIAL', 'Educación Inicial', 1, NOW()),
('PRIMER_SEGUNDO_CICLO', 'Primer y Segundo Ciclo', 2, NOW()),
('TERCER_CICLO', 'Tercer Ciclo', 3, NOW());

-- 3. Tipos de Plato
INSERT INTO tipo_plato (nombre, descripcion, orden, created_at) VALUES
('Desayuno', 'Comida principal del inicio del día', 1, NOW()),
('Almuerzo', 'Comida principal del mediodía', 2, NOW()),
('Merienda', 'Refrigerio ligero entre comidas', 3, NOW()),
('Cena', 'Comida principal de la noche', 4, NOW()),
('Refrigerio', 'Snack o bebida complementaria', 5, NOW()),
('Postre', 'Dulce o fruta para finalizar la comida', 6, NOW());

-- 4. Unidades de Medida
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

-- 5. Tipos de Insumo
INSERT INTO tipo_insumo (desc_tipo_insumo, created_at) VALUES
('Carnes', NOW()),
('Pollo', NOW()),
('Pescados y Mariscos', NOW()),
('Huevos', NOW()),
('Legumbres y Granos', NOW()),
('Lácteos', NOW()),
('Quesos', NOW()),
('Verduras y Hortalizas', NOW()),
('Frutas', NOW()),
('Cereales y Granos', NOW()),
('Harinas', NOW()),
('Pastas', NOW()),
('Panes', NOW()),
('Condimentos y Especias', NOW()),
('Aceites y Grasas', NOW()),
('Aderezos y Salsas', NOW()),
('Bebidas', NOW()),
('Enlatados y Conservas', NOW()),
('Productos de Panadería', NOW()),
('Snacks y Aperitivos', NOW()),
('Productos Congelados', NOW()),
('Productos Secos', NOW()),
('Aditivos Alimentarios', NOW());

-- Verificar que se insertaron todos los datos correctamente
SELECT 'Ciudades' as tabla, COUNT(*) as total FROM ciudad
UNION ALL
SELECT 'Niveles Escolares' as tabla, COUNT(*) as total FROM nivel_escolar
UNION ALL
SELECT 'Tipos de Plato' as tabla, COUNT(*) as total FROM tipo_plato
UNION ALL
SELECT 'Unidades de Medida' as tabla, COUNT(*) as total FROM unidad_medida
UNION ALL
SELECT 'Tipos de Insumo' as tabla, COUNT(*) as total FROM tipo_insumo;
