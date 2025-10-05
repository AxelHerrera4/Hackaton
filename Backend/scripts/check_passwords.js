import dotenv from 'dotenv';
dotenv.config();

import pool from '../src/config/db.js';
import bcrypt from 'bcrypt';

async function run() {
  try {
    console.log('📋 Verificando usuarios en la base de datos...\n');
    
    // Obtener todos los usuarios
    const { rows } = await pool.query('SELECT * FROM USUARIO ORDER BY USUARIO_ID');
    
    console.log(`Total usuarios: ${rows.length}\n`);
    
    for (const user of rows) {
      console.log(`Usuario ID: ${user.usuario_id}`);
      console.log(`  Email: ${user.usuario_user}`);
      console.log(`  Nombre: ${user.usuario_nombreong}`);
      console.log(`  Role: ${user.usuario_role}`);
      console.log(`  Hash: ${user.usuario_contrasena.substring(0, 30)}...`);
      
      // Probar contraseñas comunes
      const passwordsToTest = ['Admin@12345', 'password', '12345678', 'admin'];
      
      for (const pwd of passwordsToTest) {
        const match = await bcrypt.compare(pwd, user.usuario_contrasena);
        if (match) {
          console.log(`  ✅ Contraseña correcta: "${pwd}"`);
          break;
        }
      }
      console.log('');
    }
    
    // Ofrecer actualizar contraseñas
    console.log('\n🔧 ¿Quieres actualizar las contraseñas?');
    console.log('Ejecuta: node scripts/update_passwords.js');
    
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  }
  process.exit(0);
}

run();
