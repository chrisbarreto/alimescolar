-- Script para poblar niveles escolares
INSERT INTO nivel_escolar (nombre, descripcion, orden, created_at) VALUES
('INICIAL', 'Educación Inicial', 1, NOW()),
('PRIMER_SEGUNDO_CICLO', 'Primer y Segundo Ciclo', 2, NOW()),
('TERCER_CICLO', 'Tercer Ciclo', 3, NOW())
ON CONFLICT (nombre) DO NOTHING;

SELECT * FROM nivel_escolar ORDER BY orden;
