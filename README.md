# Sistema de Gestión de Reportes - Fundación Favorita

## 🎯 Objetivos del Sistema

Este sistema permite a la Fundación Favorita:

1. **Centralizar los reportes mensuales** de las ONGs aliadas
2. **Validar indicadores** con criterios unificados y trazables
3. **Gestionar las donaciones** de forma ágil, transparente y automatizada

## 🏗️ Arquitectura del Sistema

### Base de Datos PostgreSQL
- **Database:** `favorita`
- **Credenciales:** postgres / 12345678
- **Script SQL:** `script_favorita.sql` (listo para ejecutar en pgAdmin)

### Tablas Principales
- **USUARIO**: Fundaciones y administradores
- **EJES**: Áreas de impacto (Educación, Nutrición, Medio Ambiente, etc.)
- **INDICADORES**: KPIs específicos por eje
- **REPORTEPROYECTO**: Reportes mensuales de proyectos
- **TIENE**: Relación entre reportes y ejes

## 👥 Roles del Sistema

### 🔧 Administrador
- **Login:** admin@favorita.com / 12345678
- **Funciones:**
  - Generar reportes con Metabase
  - Exportar a Excel y PowerPoint
  - Ver métricas generales y por fundación
  - Gestionar usuarios

### 🏢 Fundaciones (Líderes)
- **Login:** fundacion@esperanza.org / 12345678
- **Login:** contacto@verde.org / 12345678
- **Funciones:**
  - Registrar KPIs mensuales
  - Subir evidencias fotográficas (Google Drive)
  - Crear reportes de proyectos
  - Ver sus métricas

## 📊 Integración con Metabase

### Configuración de Metabase
1. **URL de Metabase:** http://localhost:3030
2. **Configurar conexión a PostgreSQL:**
   - Host: localhost
   - Port: 5432
   - Database: favorita
   - Username: postgres
   - Password: 12345678

### Dashboards Disponibles
- **Dashboard General:** Métricas de todas las fundaciones
- **Dashboard por Fundación:** Métricas específicas de cada ONG
- **KPIs por Eje:** Visualización por área de impacto

## 🎨 Identidad Visual

### Tipografía Oficial
- **Logo y Títulos:** Merienda One
- **Comunicación:** Nunito / Gotham

### Colores Oficiales
- **Primario:** #E91E25 (Rojo Fundación Favorita)
- **Texto:** #2D3748
- **Grises:** #718096, #A0AEC0

## 📋 Flujo de Trabajo - KPIs Mensuales

### Para Líderes de Fundaciones:

1. **Acceder al Sistema**
   - Login con credenciales de fundación
   - Ir a "Registrar KPIs"

2. **Completar KPIs Mensuales**
   - Seleccionar mes de reporte
   - Llenar valores alcanzados por indicador
   - Agregar observaciones

3. **Subir Evidencias**
   - Enlaces de Google Drive con fotos de beneficiarios
   - Documentos de respaldo
   - Material audiovisual

4. **Guardar y Enviar**
   - Validación automática de datos
   - Confirmación de envío

### Para Administradores:

1. **Generar Reportes**
   - Acceder a "Generador de Reportes"
   - Seleccionar tipo: General o por Fundación
   - Elegir período

2. **Visualización en Metabase**
   - Dashboards automáticos
   - Gráficos interactivos
   - Filtros por fecha y fundación

3. **Exportación**
   - Excel con gráficos estadísticos
   - PowerPoint para presentaciones
   - PDFs para archivo

## 📈 KPIs Principales

### Educación
- Escuelas apoyadas (#)
- Estudiantes vulnerables capacitados (#)

### Equidad de Género
- Mujeres apoyadas FF (#)
- Mujeres estudiantes (#)

### Nutrición
- Personas con apoyo alimentario (#)

### Medio Ambiente
- CO2 evitadas (tn)
- Residuos recuperados (Tons. Met)

### Emprendimiento
- Personas capacitadas en emprendimiento (#)

## 🚀 Instalación y Configuración

### Prerequisites
1. Node.js 18+
2. PostgreSQL 13+
3. pgAdmin 4
4. Metabase (Docker recomendado)

### Backend (Puerto 3000)
```bash
cd backend
npm install
npm start
```

### Frontend (Puerto 3001)
```bash
cd frontend
npm install
npm run dev
```

### Base de Datos
1. Crear database `favorita` en PostgreSQL
2. Ejecutar `script_favorita.sql` en pgAdmin
3. Verificar que las tablas se crearon correctamente

### Metabase con Docker
```bash
docker run -d -p 3030:3000 --name metabase metabase/metabase
```

## 🔄 Workflow de Reportes

### Flujo Mensual
1. **Día 1-25 del mes:** Fundaciones registran KPIs
2. **Día 26-30:** Validación y revisión
3. **Día 1-5 del mes siguiente:** Generación de reportes
4. **Dashboards:** Actualizados automáticamente

### Evidencias Fotográficas
- **Formato:** Enlaces de Google Drive
- **Contenido:** Fotos de beneficiarios, actividades, impacto
- **Validación:** Links deben ser de dominios Google

## 📊 Reportes Generados

### Excel Reports
- Portada con nombre de fundación
- Gráficos por KPI
- Tablas de datos
- Comparativas mensuales

### PowerPoint Presentations
- Slide 1: Portada de fundación
- Slide 2-N: Gráficos estadísticos por eje
- Dashboard screenshots de Metabase

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React + TypeScript + Vite
- **Backend:** Express.js (de la rama main)
- **Base de Datos:** PostgreSQL
- **BI/Analytics:** Metabase
- **Autenticación:** Hardcoded (demo)
- **Styling:** CSS personalizado con variables

## 📝 Notas de Desarrollo

- Sistema funciona con/sin backend (fallback hardcoded)
- Diseño responsive para móviles
- Integración lista para Metabase real
- Exportación de archivos simulada (listo para implementar)

## 🎯 Próximos Pasos

1. Implementar exportación real de Excel/PowerPoint
2. Conectar Metabase con endpoints del backend
3. Sistema de notificaciones por email
4. Workflows de aprobación
5. Integración con sistemas de pago

---

**Desarrollado para Fundación Favorita** - Sistema de Gestión Integral de ONGs