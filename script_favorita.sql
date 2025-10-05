-- Script SQL para PostgreSQL - Base de datos "favorita"
-- Copia y pega este script en pgAdmin

-- Eliminar tablas si existen
DROP TABLE IF EXISTS TIENE CASCADE;
DROP TABLE IF EXISTS INDICADORES CASCADE;
DROP TABLE IF EXISTS REPORTEPROYECTO CASCADE;
DROP TABLE IF EXISTS EJES CASCADE;
DROP TABLE IF EXISTS USUARIO CASCADE;

-- Crear tabla EJES
CREATE TABLE EJES (
   EJES_ID SERIAL PRIMARY KEY,
   EJES_NOMBRE VARCHAR(124) NOT NULL,
   EJES_DESCRIPCION VARCHAR(124) NOT NULL
);

-- Crear tabla INDICADORES
CREATE TABLE INDICADORES (
   INDICADORES_ID SERIAL PRIMARY KEY,
   EJES_ID INTEGER NOT NULL,
   INDICADORES_NOMBRE VARCHAR(124) NOT NULL,
   INDICADORES_DESCRIPCION VARCHAR(124) NOT NULL,
   INDICADORES_VALOR VARCHAR(124) NOT NULL,
   FOREIGN KEY (EJES_ID) REFERENCES EJES (EJES_ID)
);

-- Crear tabla USUARIO
CREATE TABLE USUARIO (
   USUARIO_ID SERIAL PRIMARY KEY,
   USUARIO_NOMBREONG VARCHAR(124) NOT NULL,
   USUARIO_USER VARCHAR(124) NOT NULL UNIQUE,
   USUARIO_CONTRASENA VARCHAR(124) NOT NULL,
   USUARI_DESCRIPCION VARCHAR(124) NOT NULL
);

-- Crear tabla REPORTEPROYECTO
CREATE TABLE REPORTEPROYECTO (
   REPORTEPROYECTO_ID SERIAL PRIMARY KEY,
   USUARIO_ID INTEGER NOT NULL,
   REPORTEPROYECTO_NOMBRE VARCHAR(124) NOT NULL,
   REPORTEPROYECTO_FECHAINICIO DATE NOT NULL,
   REPORTEPROYECTO_FECHAFIN DATE NOT NULL,
   REPORTEPROYECTO_PERIODOSUBIRREPORTES VARCHAR(124) NOT NULL,
   REPORTEPROYECTO_ACCIONESDESTACADAS VARCHAR(124) NOT NULL,
   REPORTEPROYECTO_PRIMERHITO VARCHAR(124) NOT NULL,
   REPORTEPROYECTO_SEGUNDOHITO VARCHAR(124) NOT NULL,
   REPORTEPROYECTO_TERCERHITO VARCHAR(124) NOT NULL,
   REPORTEPROYECTO_NOMBREHITO VARCHAR(124) NOT NULL,
   REPORTEPROYECTO_LUGAR VARCHAR(128) NOT NULL,
   REPORTEPROYECTO_DESCRIPCION VARCHAR(128) NOT NULL,
   REPORTEPROYECTO_INDICADORLARGOPLAZO VARCHAR(128) NOT NULL,
   REPORTEPROYECTO_MATERIALAUDIOVISUAL VARCHAR(128) NOT NULL,
   REPORTEPROYECTO_INDICADORPREVENCION VARCHAR(128) NOT NULL,
   REPORTEPROYECTO_ESTADO VARCHAR(128) NOT NULL,
   FOREIGN KEY (USUARIO_ID) REFERENCES USUARIO (USUARIO_ID)
);

-- Crear tabla TIENE
CREATE TABLE TIENE (
   REPORTEPROYECTO_ID INTEGER NOT NULL,
   EJES_ID INTEGER NOT NULL,
   PRIMARY KEY (REPORTEPROYECTO_ID, EJES_ID),
   FOREIGN KEY (REPORTEPROYECTO_ID) REFERENCES REPORTEPROYECTO (REPORTEPROYECTO_ID),
   FOREIGN KEY (EJES_ID) REFERENCES EJES (EJES_ID)
);

-- Insertar datos en EJES
INSERT INTO EJES (EJES_ID, EJES_NOMBRE, EJES_DESCRIPCION) VALUES 
(1, 'Nutrición', 'Eje enfocado en mejorar la nutrición y seguridad alimentaria'),
(2, 'Educación', 'Eje centrado en mejorar el acceso y calidad educativa'),
(3, 'Emprendimiento', 'Eje destinado a fomentar el emprendimiento y desarrollo económico'),
(4, 'Medio Ambiente', 'Eje enfocado en la conservación y protección ambiental'),
(5, 'Equidad de Género', 'Eje centrado en promover la equidad e inclusión de género'),
(7, 'Educación - Equidad de Género', 'Eje enfocado en promover la formación educativa con enfoque de equidad e inclusión de género');

-- Insertar datos en USUARIO
INSERT INTO USUARIO (USUARIO_ID, USUARIO_NOMBREONG, USUARIO_USER, USUARIO_CONTRASENA, USUARI_DESCRIPCION) VALUES
(1, 'Administrador Sistema', 'admin@favorita.com', '12345678', 'Administrador del sistema'),
(2, 'Fundación Esperanza', 'fundacion@esperanza.org', '12345678', 'Fundación dedicada a la educación'),
(3, 'Fundación Verde', 'contacto@verde.org', '12345678', 'Fundación enfocada en medio ambiente');

-- Insertar datos en INDICADORES (algunos ejemplos principales)
INSERT INTO INDICADORES (INDICADORES_ID, EJES_ID, INDICADORES_NOMBRE, INDICADORES_DESCRIPCION, INDICADORES_VALOR) VALUES 
(1, 2, 'Escuelas apoyadas (#)', 'Número total de escuelas que reciben apoyo del programa educativo', '25'),
(2, 5, 'Mujeres apoyadas FF (estudiantes) #', 'Cantidad de mujeres estudiantes beneficiadas con apoyo del programa de Equidad de Género', '150'),
(3, 1, 'Personas con alimentos, cuidado y/o guía en nutrición (#)', 'Número de personas beneficiadas con apoyo alimentario, orientación o cuidado nutricional', '300'),
(4, 5, 'Mujeres apoyadas FF (#)', 'Cantidad total de mujeres beneficiadas a través de los programas de equidad e inclusión', '200'),
(5, 2, 'Estudiantes vulnerables con capacitaciones puntuales (#)', 'Número de estudiantes en situación vulnerable que participan en capacitaciones específicas', '75'),
(15, 3, 'Educación en emprendimiento. Personas capacitadas (#)', 'Número de personas que participaron en capacitaciones o talleres de emprendimiento', '45'),
(20, 4, 'CO2 evitadas (tn)', 'Toneladas de CO2 evitadas mediante acciones de mitigación ambiental', '12.5'),
(24, 4, 'Recuperación de residuos (Tons. Met)', 'Cantidad de residuos recuperados en toneladas métricas a través de programas ambientales', '8.3');

-- Insertar datos en REPORTEPROYECTO
INSERT INTO REPORTEPROYECTO (REPORTEPROYECTO_ID, USUARIO_ID, REPORTEPROYECTO_NOMBRE, REPORTEPROYECTO_FECHAINICIO, REPORTEPROYECTO_FECHAFIN, REPORTEPROYECTO_PERIODOSUBIRREPORTES, REPORTEPROYECTO_ACCIONESDESTACADAS, REPORTEPROYECTO_PRIMERHITO, REPORTEPROYECTO_SEGUNDOHITO, REPORTEPROYECTO_TERCERHITO, REPORTEPROYECTO_NOMBREHITO, REPORTEPROYECTO_LUGAR, REPORTEPROYECTO_DESCRIPCION, REPORTEPROYECTO_INDICADORLARGOPLAZO, REPORTEPROYECTO_MATERIALAUDIOVISUAL, REPORTEPROYECTO_INDICADORPREVENCION, REPORTEPROYECTO_ESTADO) VALUES
(1, 2, 'Programa Educativo Rural 2024', '2024-01-15', '2024-12-15', 'Mensual', 'Implementación de laboratorios', 'Selección escuelas', 'Capacitación docentes', 'Implementación lab', 'Evaluación impacto', 'Zona rural Pichincha', 'Proyecto educativo rural', 'Mejora 30% calificaciones', 'Videos educativos', 'Reducción deserción 15%', 'En ejecución'),
(2, 3, 'Proyecto Reforestación Urbana', '2024-03-01', '2024-11-30', 'Trimestral', 'Plantación 1000 árboles', 'Identificación áreas', 'Adquisición plantas', 'Jornadas plantación', 'Seguimiento cuidado', 'Parques urbanos Quito', 'Reforestación urbana', 'Incremento 20% área verde', 'Documentales', 'Reducción 500tn CO2', 'En planificación');

-- Insertar datos en TIENE
INSERT INTO TIENE (REPORTEPROYECTO_ID, EJES_ID) VALUES
(1, 2),
(1, 5),
(2, 4);

-- Actualizar secuencias para que coincidan con los IDs insertados
SELECT setval('ejes_ejes_id_seq', (SELECT MAX(ejes_id) FROM ejes));
SELECT setval('usuario_usuario_id_seq', (SELECT MAX(usuario_id) FROM usuario));
SELECT setval('indicadores_indicadores_id_seq', (SELECT MAX(indicadores_id) FROM indicadores));
SELECT setval('reporteproyecto_reporteproyecto_id_seq', (SELECT MAX(reporteproyecto_id) FROM reporteproyecto));

-- Verificar datos creados
SELECT 'EJES' as tabla, count(*) as total FROM EJES
UNION ALL
SELECT 'INDICADORES' as tabla, count(*) as total FROM INDICADORES
UNION ALL
SELECT 'USUARIO' as tabla, count(*) as total FROM USUARIO
UNION ALL
SELECT 'REPORTEPROYECTO' as tabla, count(*) as total FROM REPORTEPROYECTO
UNION ALL
SELECT 'TIENE' as tabla, count(*) as total FROM TIENE;

-- Consulta de ejemplo para verificar relaciones
SELECT 
    e.EJES_NOMBRE,
    COUNT(i.INDICADORES_ID) as num_indicadores
FROM EJES e
LEFT JOIN INDICADORES i ON e.EJES_ID = i.EJES_ID
GROUP BY e.EJES_ID, e.EJES_NOMBRE
ORDER BY e.EJES_ID;