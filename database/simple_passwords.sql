-- Actualizar contraseñas a texto plano para MVP
UPDATE users SET password_hash = 'admin123' WHERE email = 'admin@corporacionfavorita.com';
UPDATE users SET password_hash = 'revisor123' WHERE email = 'revisor@corporacionfavorita.com';
UPDATE users SET password_hash = 'tesoreria123' WHERE email = 'tesoreria@corporacionfavorita.com';
UPDATE users SET password_hash = 'lider123' WHERE email = 'lider@fundacionesperanza.org';

-- Verificar los cambios
SELECT email, password_hash, role FROM users;