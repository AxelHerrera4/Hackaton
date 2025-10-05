import express from 'express';

// importa las rutas espec├¡ficas
import ejeRoutes from './ejeRoutes.js';
import indicadoresRoutes from './indicadoresRoutes.js';
import reporteRoutes from './reporteRoutes.js';
import tieneRoutes from './tieneRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Caracteristicas
 *     description: Endpoints para gesti├│n de caracter├¡sticas de las socias
 *   - name: Profesion
 *     description: Endpoints para gesti├│n de profesiones de las socias
 *   - name: TipoSocias
 *     description: Endpoints para gesti├│n de tipos de socias
 *   - name: Inventario
 *     description: Endpoints para gesti├│n del inventario
 *   - name: Mentores
 *     description: Endpoints para gesti├│n de mentores
 *   - name: FormatoCarnet
 *     description: Endpoints para gesti├│n de formatos de carnet
 *   - name: Carnet
 *     description: Endpoints para gesti├│n de los carnets
 */

// se montan las rutas en paths base
router.use('/eje', ejeRoutes);
router.use('/indicadores', indicadoresRoutes);
router.use('/reporte', reporteRoutes);
router.use('/tiene', tieneRoutes);
router.use('/usuario', usuarioRoutes);


export default router;
