# La Corporación Favorita - MVP

Sistema completo para gestión de reportes mensuales de ONGs, validación de indicadores y gestión de donaciones con pagos Plux.

## Tecnologías
- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS + TypeScript  
- **Base de datos**: PostgreSQL
- **Automatizaciones**: n8n
- **Dashboards**: Metabase
- **Pagos**: Plux

## Instalación Local (Sin Docker)

### 1. Requisitos Previos
- Node.js 18+ 
- PostgreSQL 15+
- npm o yarn

### 2. Base de Datos

**Con PgAdmin (Tu caso):**
1. Abre PgAdmin
2. Crea una base de datos llamada `favorita`
3. Ejecuta el script de inicialización:

```sql
-- Copia y pega el contenido de database/init.sql en PgAdmin Query Tool
-- O ejecuta desde terminal:
psql -U postgres -d favorita -f .\database\init.sql
```

### 3. Backend (NestJS)
```powershell
cd backend
npm install

# Crear archivo de configuración
echo 'DATABASE_URL="postgresql://postgres:12345678@localhost:5432/favorita"
JWT_SECRET="tu-clave-secreta-aqui"
PLUX_CLIENT_ID="uj8Yic1a8MbQTdZ0W1yXk524QP"
PLUX_SECRET_KEY="7nG9a6srN5sOHHngRekJo1pkxS4cnxEVvc0xnsAVPfJmE8Kq"
PLUX_BUSINESS_ID="921"
PLUX_RUC="1792236894001"
PLUX_EMAIL="correoplux@gmail.com"
N8N_WEBHOOK_URL="http://localhost:5678"' > .env

npm run start:dev
```

### 4. Frontend (React)
```powershell
cd frontend  
npm install
npm run dev
```

### 5. n8n (Automatizaciones)
```powershell
npm install -g n8n
n8n start
```

## URLs de Acceso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **n8n**: http://localhost:5678

## Credenciales por Defecto
- **Admin**: admin@corporacionfavorita.com / password
- **Revisor**: revisor@corporacionfavorita.com / password  
- **Tesorería**: tesoreria@corporacionfavorita.com / password
- **Líder Fundación**: lider@fundacionesperanza.org / password

## Próximos Pasos
1. ✅ Configurar base de datos
2. ⏳ Completar backend NestJS
3. ⏳ Crear frontend React
4. ⏳ Configurar workflows n8n
5. ⏳ Integración con Plux