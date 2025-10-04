import express from 'express';

// importa las rutas específicas
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
 *     description: Endpoints para gestión de características de las socias
 *   - name: Profesion
 *     description: Endpoints para gestión de profesiones de las socias
 *   - name: TipoSocias
 *     description: Endpoints para gestión de tipos de socias
 *   - name: Inventario
 *     description: Endpoints para gestión del inventario
 *   - name: Mentores
 *     description: Endpoints para gestión de mentores
 *   - name: FormatoCarnet
 *     description: Endpoints para gestión de formatos de carnet
 *   - name: Carnet
 *     description: Endpoints para gestión de los carnets
 */

// se montan las rutas en paths base
router.use('/eje', ejeRoutes);
router.use('/indicadores', indicadoresRoutes);
router.use('/reporte', reporteRoutes);
router.use('/tiene', tieneRoutes);
router.use('/usuario', usuarioRoutes);


export default router;
