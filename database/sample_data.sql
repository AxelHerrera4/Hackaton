-- Agregar proyectos de ejemplo para pruebas
INSERT INTO projects (foundation_id, name, description, start_date, end_date, status, created_at, updated_at) VALUES
(2, 'Programa Nutrición Infantil', 'Programa para reducir la desnutrición crónica infantil en comunidades rurales', '2025-01-01', '2025-12-31', 'active', now(), now()),
(2, 'Educación Digital Comunitaria', 'Programa de alfabetización digital para mujeres rurales', '2025-02-01', '2025-11-30', 'active', now(), now());

-- Agregar algunos project_indicators de ejemplo
INSERT INTO project_indicators (project_id, indicator_id, target_value, created_at) VALUES
(1, 1, 10.0, now()),  -- DCI target 10%
(1, 2, 1000.0, now()), -- Alimentos entregados target 1000kg
(1, 3, 500.0, now()),  -- Raciones de alimentos target 500
(1, 4, 200.0, now()),  -- Beneficiarios target 200 personas
(2, 5, 5.0, now()),    -- Escuelas apoyadas target 5
(2, 6, 85.0, now()),   -- Asistencia escolar target 85%
(2, 7, 20.0, now());   -- Capacitaciones target 20

-- Agregar reportes de ejemplo
INSERT INTO reports (project_id, foundation_id, period_year, period_month, data, status, created_at, updated_at) VALUES
(1, 2, 2025, 9, '{"DCI (Desnutrición Crónica Infantil)": 12.5, "Alimentos entregados": 800, "Raciones de alimentos": 400, "Beneficiarios con alimentos": 180}', 'pending', now(), now()),
(2, 2, 2025, 9, '{"Escuelas apoyadas": 4, "Asistencia a la escuela": 82.5, "Capacitaciones en habilidades blandas y duras": 15}', 'approved', now(), now());

-- Agregar solicitudes de pago de ejemplo
INSERT INTO payment_requests (report_id, amount, currency, status, created_by, created_at, updated_at) VALUES
(2, 2500.00, 'USD', 'pending', 3, now(), now());