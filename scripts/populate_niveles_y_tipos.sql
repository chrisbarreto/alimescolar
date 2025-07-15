-- Cargar niveles escolares
INSERT INTO nivel_escolar (nombre, descripcion, orden) VALUES
('INICIAL', 'Educación Inicial (3-5 años)', 1),
('PRIMER_SEGUNDO_CICLO', 'Primer y Segundo Ciclo EEB (6-11 años)', 2),
('TERCER_CICLO', 'Tercer Ciclo EEB (12-14 años)', 3);

-- Cargar tipos de plato
INSERT INTO tipo_plato (nombre, descripcion, orden) VALUES
('Almuerzo', 'Comida principal del mediodía', 1),
('Desayuno', 'Primera comida del día', 2),
('Merienda', 'Refrigerio de la tarde', 3),
('Cena', 'Comida de la noche', 4),
('Refrigerio', 'Snack entre comidas', 5),
('Postre', 'Dulce para finalizar', 6);
