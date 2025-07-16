-- Verificar los insumos cargados
SELECT 
    i.nombre_insumo as "Insumo",
    ti.desc_tipo_insumo as "Tipo",
    um.desc_unidad_medida as "Unidad",
    um.abreviatura as "Abrev"
FROM insumo i
JOIN tipo_insumo ti ON i.id_tipo_insumo = ti.id_tipo_insumo
JOIN unidad_medida um ON i.id_unidad_medida = um.id_unidad_medida
ORDER BY ti.desc_tipo_insumo, i.nombre_insumo;
