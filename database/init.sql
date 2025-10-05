-- Inicialización de la base de datos para La Corporación Favorita MVP
-- Drop tables if exist to reset schema (para desarrollo)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS payment_requests CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS project_indicators CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS foundation_axes CASCADE;
DROP TABLE IF EXISTS indicators CASCADE;
DROP TABLE IF EXISTS axes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS foundations CASCADE;

-- Crear tablas principales
CREATE TABLE foundations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'lider', 'revisor', 'tesoreria')),
  foundation_id INT REFERENCES foundations(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE axes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE indicators (
  id SERIAL PRIMARY KEY,
  axis_id INT REFERENCES axes(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50),
  formula TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_by INT REFERENCES users(id),
  approved BOOLEAN DEFAULT false,
  approved_by INT REFERENCES users(id),
  approved_at TIMESTAMP,
  justification TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE foundation_axes (
  id SERIAL PRIMARY KEY,
  foundation_id INT REFERENCES foundations(id),
  axis_id INT REFERENCES axes(id),
  is_primary BOOLEAN DEFAULT false,
  selected_at TIMESTAMP DEFAULT now(),
  UNIQUE(foundation_id, axis_id)
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  foundation_id INT REFERENCES foundations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  report_start_date DATE,
  report_end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE project_indicators (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  indicator_id INT REFERENCES indicators(id),
  target_value NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, indicator_id)
);

CREATE TABLE milestones (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  location TEXT,
  description TEXT,
  guide_questions JSONB,
  month_year DATE,
  attachments JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  foundation_id INT REFERENCES foundations(id),
  period_year INT NOT NULL,
  period_month INT NOT NULL CHECK (period_month >= 1 AND period_month <= 12),
  data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'ready_for_payment', 'paid')),
  attachments JSONB,
  rejection_reason TEXT,
  reviewed_by INT REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, period_year, period_month)
);

CREATE TABLE payment_requests (
  id SERIAL PRIMARY KEY,
  report_id INT REFERENCES reports(id),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'link_generated', 'paid', 'failed')),
  plux_payment_link TEXT,
  plux_payment_id VARCHAR(255),
  metadata JSONB,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  actor_id INT REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INT NOT NULL,
  payload JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Insertar datos iniciales

-- Ejes principales
INSERT INTO axes (name, description) VALUES
('Nutrición', 'Programas enfocados en seguridad alimentaria y nutrición'),
('Educación', 'Iniciativas educativas y formación'),
('Emprendimiento', 'Apoyo a emprendedores y desarrollo económico'),
('Ambiente', 'Conservación ambiental y sostenibilidad'),
('Equidad de Género', 'Promoción de igualdad y equidad de género'),
('Emergencias', 'Respuesta y atención en situaciones de emergencia');

-- KPIs principales por eje
INSERT INTO indicators (axis_id, name, description, unit, approved, is_custom) VALUES
-- Nutrición
(1, 'DCI (Desnutrición Crónica Infantil)', 'Porcentaje de niños con desnutrición crónica', '%', true, false),
(1, 'Alimentos entregados', 'Cantidad de alimentos distribuidos', 'kg', true, false),
(1, 'Raciones de alimentos', 'Número de raciones alimentarias distribuidas', 'unidades', true, false),
(1, 'Beneficiarios con alimentos', 'Personas que recibieron asistencia alimentaria', 'personas', true, false),

-- Educación
(2, 'Escuelas apoyadas', 'Número de instituciones educativas beneficiadas', 'escuelas', true, false),
(2, 'Asistencia a la escuela', 'Porcentaje de asistencia escolar', '%', true, false),
(2, 'Capacitaciones en habilidades blandas y duras', 'Número de capacitaciones impartidas', 'capacitaciones', true, false),

-- Emprendimiento
(3, 'Emprendedores apoyados', 'Número de emprendedores beneficiados', 'personas', true, false),
(3, 'Formación en emprendimiento', 'Horas de formación en emprendimiento', 'horas', true, false),

-- Ambiente
(4, 'Conciencia ambiental', 'Personas sensibilizadas en temas ambientales', 'personas', true, false),

-- Equidad de Género
(5, 'Formación en habilidades para la disminución de la brecha de género', 'Capacitaciones para reducir brecha de género', 'capacitaciones', true, false),
(5, 'Formación en habilidades digitales', 'Personas capacitadas en habilidades digitales', 'personas', true, false),
(5, 'Mujeres beneficiarias de todos los programas', 'Número de mujeres beneficiadas', 'mujeres', true, false),

-- Emergencias
(6, 'Atención en emergencias', 'Personas atendidas en situaciones de emergencia', 'personas', true, false);

-- Usuario administrador por defecto
INSERT INTO foundations (name, contact_email) VALUES
('Administración Central', 'admin@corporacionfavorita.com');

INSERT INTO users (email, password_hash, full_name, role, foundation_id) VALUES
('admin@corporacionfavorita.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador Sistema', 'admin', 1),
('revisor@corporacionfavorita.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Revisor General', 'revisor', 1),
('tesoreria@corporacionfavorita.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tesorería', 'tesoreria', 1);

-- Fundación de ejemplo para demo
INSERT INTO foundations (name, contact_email) VALUES
('Fundación Esperanza', 'contacto@fundacionesperanza.org');

INSERT INTO users (email, password_hash, full_name, role, foundation_id) VALUES
('lider@fundacionesperanza.org', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María González', 'lider', 2);

-- Índices para mejorar performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_period ON reports(period_year, period_month);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_indicators_axis ON indicators(axis_id);
CREATE INDEX idx_indicators_approved ON indicators(approved);

-- Comentarios para documentación
COMMENT ON TABLE foundations IS 'Organizaciones/fundaciones registradas en el sistema';
COMMENT ON TABLE users IS 'Usuarios del sistema con diferentes roles';
COMMENT ON TABLE axes IS 'Ejes temáticos principales (Nutrición, Educación, etc.)';
COMMENT ON TABLE indicators IS 'KPIs/indicadores por eje temático';
COMMENT ON TABLE reports IS 'Reportes mensuales de las fundaciones';
COMMENT ON TABLE payment_requests IS 'Solicitudes de pago basadas en reportes aprobados';
COMMENT ON TABLE audit_logs IS 'Registro de auditoría de todas las acciones importantes';

-- Notas sobre contraseñas por defecto (SOLO PARA DESARROLLO)
-- password: todas las cuentas tienen la contraseña "password" hasheada con bcrypt
-- En producción estas contraseñas deben cambiarse inmediatamente