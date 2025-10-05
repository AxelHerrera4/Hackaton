import dotenv from 'dotenv';
dotenv.config();

import pool from '../src/config/db.js';
import bcrypt from 'bcrypt';

async function run() {
  try {
    console.log('🔧 Actualizando contraseñas de usuarios...\n');
    
    const newPassword = 'Admin@12345';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log(`Nueva contraseña: ${newPassword}`);
    console.log(`Hash generado: ${hashedPassword}\n`);
    
    // Actualizar todos los usuarios
    const updateQuery = `
      UPDATE USUARIO 
      SET USUARIO_CONTRASENA = $1 
      WHERE USUARIO_ID IN (1, 2, 3)
      RETURNING USUARIO_ID, USUARIO_USER, USUARIO_NOMBREONG
    `;
    
    const { rows } = await pool.query(updateQuery, [hashedPassword]);
    
    console.log(`✅ ${rows.length} usuarios actualizados:\n`);
    
    for (const user of rows) {
      console.log(`  - ${user.usuario_user} (${user.usuario_nombreong})`);
    }
    
    console.log('\n🔑 Credenciales actualizadas:');
    console.log('   Email: admin@favorita.com');
    console.log('   Email: fundacion@esperanza.org');
    console.log('   Email: contacto@verde.org');
    console.log(`   Contraseña para todos: ${newPassword}`);
    
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  }
  process.exit(0);
}

run();
