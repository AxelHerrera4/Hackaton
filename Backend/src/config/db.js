import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Parsear DATABASE_URL si existe (para Docker), sino usar variables individuales
let poolConfig;

if (process.env.DATABASE_URL) {
  // Usar DATABASE_URL directamente (formato: postgresql://user:password@host:port/database)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  };
} else {
  // Usar variables individuales con valores por defecto que coincidan con docker-compose
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "12345678",
    database: process.env.DB_NAME || "favorita",
    max: 10,
    idleTimeoutMillis: 30000,
  };
}

const pool = new Pool(poolConfig);

// Verificar conexión al iniciar
pool.on('connect', () => {
  console.log('✅ Conexión exitosa a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
});

export default pool;
