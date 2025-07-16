-- Script para poblar datos de ejemplo (organizaciones e insumos)
-- Ejecutar DESPUÉS de populate_all_catalogs.sql

-- 1. Organizaciones de ejemplo
INSERT INTO organizaciones (razon_social, ruc, direccion, id_ciudad, created_at) VALUES
('Colegio San José', '900123456-1', 'Calle 123 # 45-67', 1, NOW()),
('Institución Educativa Los Andes', '900234567-2', 'Carrera 10 # 20-30', 2, NOW()),
('Escuela Rural El Progreso', '900345678-3', 'Vereda El Progreso', 3, NOW()),
('Colegio Nacional Simón Bolívar', '900456789-4', 'Avenida Bolívar # 100-200', 1, NOW()),
('Liceo Pedagógico del Norte', '900567890-5', 'Calle Norte # 50-100', 4, NOW())
ON CONFLICT DO NOTHING;

-- 2. Insumos de ejemplo
INSERT INTO insumo (nombre_insumo, descripcion, id_tipo_insumo, id_unidad_medida, created_at) VALUES
-- Carnes (tipo 1)
('Carne de Res', 'Carne de res fresca', 1, 2, NOW()),
('Carne de Cerdo', 'Carne de cerdo fresca', 1, 2, NOW()),
-- Pollo (tipo 2)
('Pollo Entero', 'Pollo entero fresco', 2, 2, NOW()),
('Pechuga de Pollo', 'Pechuga de pollo sin hueso', 2, 2, NOW()),
-- Pescados (tipo 3)
('Tilapia', 'Filete de tilapia fresco', 3, 2, NOW()),
('Salmón', 'Filete de salmón fresco', 3, 2, NOW()),
-- Huevos (tipo 4)
('Huevos de Gallina', 'Huevos frescos de gallina', 4, 5, NOW()),
-- Legumbres (tipo 5)
('Frijoles Rojos', 'Frijoles rojos secos', 5, 2, NOW()),
('Lentejas', 'Lentejas secas', 5, 2, NOW()),
('Garbanzos', 'Garbanzos secos', 5, 2, NOW()),
-- Lácteos (tipo 6)
('Leche Entera', 'Leche entera pasteurizada', 6, 4, NOW()),
('Yogur Natural', 'Yogur natural sin azúcar', 6, 1, NOW()),
-- Quesos (tipo 7)
('Queso Campesino', 'Queso fresco campesino', 7, 1, NOW()),
('Queso Mozzarella', 'Queso mozzarella', 7, 1, NOW()),
-- Verduras (tipo 8)
('Tomate', 'Tomate fresco', 8, 2, NOW()),
('Cebolla Blanca', 'Cebolla blanca fresca', 8, 2, NOW()),
('Zanahoria', 'Zanahoria fresca', 8, 2, NOW()),
('Papa Criolla', 'Papa criolla fresca', 8, 2, NOW()),
('Lechuga', 'Lechuga fresca', 8, 5, NOW()),
-- Frutas (tipo 9)
('Manzana', 'Manzana fresca', 9, 5, NOW()),
('Banano', 'Banano maduro', 9, 5, NOW()),
('Naranja', 'Naranja fresca', 9, 5, NOW()),
-- Cereales (tipo 10)
('Arroz Blanco', 'Arroz blanco grano largo', 10, 2, NOW()),
('Avena', 'Avena en hojuelas', 10, 2, NOW()),
-- Harinas (tipo 11)
('Harina de Trigo', 'Harina de trigo todo uso', 11, 2, NOW()),
-- Condimentos (tipo 14)
('Sal', 'Sal de mesa refinada', 14, 1, NOW()),
('Pimienta Negra', 'Pimienta negra molida', 14, 1, NOW()),
('Ajo', 'Ajo fresco', 14, 2, NOW()),
-- Aceites (tipo 15)
('Aceite de Girasol', 'Aceite de girasol refinado', 15, 4, NOW()),
('Aceite de Oliva', 'Aceite de oliva extra virgen', 15, 4, NOW())
ON CONFLICT DO NOTHING;

-- Verificar las inserciones
SELECT 'Organizaciones creadas:' as info;
SELECT o.razon_social, c.nombre_ciudad 
FROM organizaciones o 
JOIN ciudad c ON o.id_ciudad = c.id_ciudad 
ORDER BY o.id_organizacion;

SELECT 'Insumos por tipo:' as info;
SELECT ti.desc_tipo_insumo, COUNT(i.id_insumo) as cantidad_insumos
FROM tipo_insumo ti
LEFT JOIN insumo i ON ti.id_tipo_insumo = i.id_tipo_insumo
GROUP BY ti.id_tipo_insumo, ti.desc_tipo_insumo
ORDER BY ti.id_tipo_insumo;
