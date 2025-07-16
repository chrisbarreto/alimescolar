-- Verificar datos insertados en todas las tablas de catálogos
SELECT 'Ciudades' as tabla, COUNT(*) as total FROM ciudad
UNION ALL
SELECT 'Niveles Escolares' as tabla, COUNT(*) as total FROM nivel_escolar
UNION ALL
SELECT 'Tipos de Plato' as tabla, COUNT(*) as total FROM tipo_plato
UNION ALL
SELECT 'Unidades de Medida' as tabla, COUNT(*) as total FROM unidad_medida
UNION ALL
SELECT 'Tipos de Insumo' as tabla, COUNT(*) as total FROM tipo_insumo;

-- Mostrar algunos registros de cada tabla
SELECT 'CIUDADES:' as info;
SELECT * FROM ciudad ORDER BY id_ciudad LIMIT 5;

SELECT 'NIVELES ESCOLARES:' as info;
SELECT * FROM nivel_escolar ORDER BY orden;

SELECT 'TIPOS DE PLATO:' as info;
SELECT * FROM tipo_plato ORDER BY orden;

SELECT 'UNIDADES DE MEDIDA:' as info;
SELECT * FROM unidad_medida ORDER BY id_unidad_medida;

SELECT 'TIPOS DE INSUMO:' as info;
SELECT * FROM tipo_insumo ORDER BY id_tipo_insumo LIMIT 10;
