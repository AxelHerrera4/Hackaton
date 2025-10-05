-- Actualizar contraseña del administrador
UPDATE users 
SET password_hash = '$2a$10$bEWa3TTN2kzTC9kdkn/qDesdfSjBZF/e4v24dRJdxDWA4GZXZFvH.' 
WHERE email = 'admin@corporacionfavorita.com';

-- Verificar el cambio
SELECT email, password_hash FROM users WHERE email = 'admin@corporacionfavorita.com';