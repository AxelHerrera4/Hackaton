import dotenv from 'dotenv';
dotenv.config();

import { UsuarioService } from '../src/services/usuarioServices.js';
import pool from '../src/config/db.js';

async function run() {
  const svc = new UsuarioService();
  try {
    // Verificar si el usuario ya existe
    const checkQuery = 'SELECT * FROM USUARIO WHERE USUARIO_USER = $1';
    const result = await pool.query(checkQuery, ['admin@favorita.com']);
    
    if (result.rows.length > 0) {
      console.log('✅ El usuario admin@favorita.com ya existe:');
      console.log({
        id: result.rows[0].usuario_id,
        email: result.rows[0].usuario_user,
        role: result.rows[0].usuario_role,
        nombre: result.rows[0].usuario_nombreong
      });
      console.log('\n💡 Puedes usar estas credenciales para iniciar sesión:');
      console.log('   Email: admin@favorita.com');
      console.log('   Contraseña: Admin@12345');
    } else {
      // Si no existe, crear el usuario
      const admin = await svc.createUsuario({
        USUARIO_NOMBREONG: 'ADMIN',
        USUARIO_USER: 'admin@favorita.com',
        USUARIO_CONTRASENA: 'Admin@12345',
        USUARIO_ROLE: 'admin',
        USUARI_DESCRIPCION: 'Cuenta administrador quemada'    
      });
      console.log('✅ Admin creado exitosamente:', admin);
    }
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  }
  process.exit(0);
}

run();
