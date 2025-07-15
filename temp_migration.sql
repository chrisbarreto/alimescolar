-- Eliminar la relación foreign key y la columna id_escuela de la tabla plato
ALTER TABLE plato DROP CONSTRAINT IF EXISTS plato_idEscuela_fkey;
ALTER TABLE plato DROP COLUMN IF EXISTS id_escuela;
