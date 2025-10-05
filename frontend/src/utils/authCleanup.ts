// Utilidad para limpiar localStorage de tokens inválidos
export const cleanAuthStorage = () => {
  const token = localStorage.getItem('token');
  
  // Verificar si el token es inválido
  if (!token || 
      token === 'null' || 
      token === 'undefined' || 
      token.trim() === '' ||
      token === 'bearer null' ||
      token === 'Bearer null') {
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    console.log('🧹 Auth storage cleaned - invalid token removed');
    return true;
  }
  
  // Verificar formato JWT básico
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      console.log('🧹 Auth storage cleaned - malformed JWT removed');
      return true;
    }
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    console.log('🧹 Auth storage cleaned - corrupted token removed');
    return true;
  }
  
  return false;
};

// Auto-limpiar al cargar la aplicación
if (typeof window !== 'undefined') {
  cleanAuthStorage();
}