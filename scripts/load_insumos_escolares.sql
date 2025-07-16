-- Script para cargar insumos específicos del sistema alimentario escolar
-- Usando subconsultas para obtener los IDs correctos

-- Ahora insertamos los insumos específicos usando subconsultas
INSERT INTO insumo (nombre_insumo, id_tipo_insumo, id_unidad_medida) VALUES
-- Carnes y Aves con gramos
('Carne vacuna magra', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Carnes y Aves' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Carne porcina magra', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Carnes y Aves' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Pechuga de pollo', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Carnes y Aves' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),

-- Lácteos y Huevos
('Queso Paraguay', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Lácteos y Huevos' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Leche fluida', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Lácteos y Huevos' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'ml' LIMIT 1)),

-- Leguminosas
('Poroto', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Leguminosas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Arveja', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Leguminosas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),

-- Cereales y Granos
('Arroz', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Cereales y Granos' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Fideo', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Cereales y Granos' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Harina de maíz', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Cereales y Granos' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Fécula de maíz', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Cereales y Granos' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Polenta', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Cereales y Granos' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),

-- Verduras y Hortalizas
('Tomate', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Cebolla', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Locote', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Zanahoria', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Lechuga', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Repollo', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Remolacha', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Zapallo', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Papa', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Cebollita de hoja', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Verduras y Hortalizas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),

-- Frutas
('Banana', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Frutas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Naranja', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Frutas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Mandarina', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Frutas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Melón', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Frutas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Frutas de estación', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Frutas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),

-- Aceites y Grasas
('Margarina', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Aceites y Grasas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Aceite', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Aceites y Grasas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'ml' LIMIT 1)),

-- Condimentos y Especias
('Ajo', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Perejil', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Laurel', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Orégano', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Anís', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Canela', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Piel de naranja o limón', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Sal yodada', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Condimentos y Especias' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),

-- Azúcares y Dulces
('Azúcar', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Azúcares y Dulces' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),
('Dulce de membrillo/batata', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Azúcares y Dulces' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'g' LIMIT 1)),

-- Bebidas
('Agua potable', 
 (SELECT id_tipo_insumo FROM tipo_insumo WHERE desc_tipo_insumo = 'Bebidas' LIMIT 1),
 (SELECT id_unidad_medida FROM unidad_medida WHERE abreviatura = 'ml' LIMIT 1));

-- Verificar los insumos insertados
SELECT i.nombre_insumo, ti.desc_tipo_insumo, um.desc_unidad_medida, um.abreviatura
FROM insumo i
JOIN tipo_insumo ti ON i.id_tipo_insumo = ti.id_tipo_insumo
JOIN unidad_medida um ON i.id_unidad_medida = um.id_unidad_medida
ORDER BY ti.desc_tipo_insumo, i.nombre_insumo;
