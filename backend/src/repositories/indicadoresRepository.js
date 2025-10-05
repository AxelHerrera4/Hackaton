import pool from '../config/db.js';

export class IndicadoresRepository {
  async create(indicador) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(indicadores_id), 0) + 1 AS nextId FROM INDICADORES`);
    const nextId = rowsMax[0].nextid;

    const query = `
      INSERT INTO INDICADORES (indicadores_id, eje_id, indicadores_nombre, indicadores_descripcion)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        indicadores_id as INDICADORES_ID,
        eje_id as EJES_ID,
        indicadores_nombre as INDICADORES_NOMBRE,
        indicadores_descripcion as INDICADORES_DESCRIPCION
    `;
    const values = [nextId, indicador.EJES_ID, indicador.INDICADORES_NOMBRE, indicador.INDICADORES_DESCRIPCION];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const query = `
      SELECT 
        i.indicadores_id,
        i.eje_id,
        i.indicadores_nombre,
        i.indicadores_descripcion,
        e.eje_nombre
      FROM INDICADORES i
      LEFT JOIN EJES e ON i.eje_id = e.eje_id
      ORDER BY i.indicadores_id
    `;
    const { rows } = await pool.query(query);
    
    // Transformar a la estructura esperada por el frontend
    return rows.map(row => ({
      INDICADORES_ID: row.indicadores_id,
      EJES_ID: row.eje_id,
      INDICADORES_NOMBRE: row.indicadores_nombre,
      INDICADORES_DESCRIPCION: row.indicadores_descripcion,
      eje: row.eje_nombre ? {
        EJES_ID: row.eje_id,
        EJES_NOMBRE: row.eje_nombre
      } : null
    }));
  }

  async buscarPorId(id) {
    const query = `
      SELECT 
        i.indicadores_id as INDICADORES_ID,
        i.eje_id as EJES_ID,
        i.indicadores_nombre as INDICADORES_NOMBRE,
        i.indicadores_descripcion as INDICADORES_DESCRIPCION,
        e.eje_nombre as eje_nombre
      FROM INDICADORES i
      LEFT JOIN EJES e ON i.eje_id = e.eje_id
      WHERE i.indicadores_id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length > 0) {
      const row = rows[0];
      return {
        ...row,
        eje: row.eje_nombre ? {
          EJES_ID: row.EJES_ID,
          EJES_NOMBRE: row.eje_nombre
        } : null
      };
    }
    return rows;
  }

  async buscarPorEje(ejesId) {
    const query = `
      SELECT 
        i.indicadores_id as INDICADORES_ID,
        i.eje_id as EJES_ID,
        i.indicadores_nombre as INDICADORES_NOMBRE,
        i.indicadores_descripcion as INDICADORES_DESCRIPCION,
        e.eje_nombre as eje_nombre
      FROM INDICADORES i
      LEFT JOIN EJES e ON i.eje_id = e.eje_id
      WHERE i.eje_id = $1
      ORDER BY i.indicadores_id
    `;
    const { rows } = await pool.query(query, [ejesId]);
    
    return rows.map(row => ({
      ...row,
      eje: row.eje_nombre ? {
        EJES_ID: row.EJES_ID,
        EJES_NOMBRE: row.eje_nombre
      } : null
    }));
  }

  async eliminar(id) {
    const { rowCount } = await pool.query(`DELETE FROM INDICADORES WHERE indicadores_id = $1`, [id]);
    return rowCount > 0;
  }

  async actualizar(indicador) {
    const campos = [];
    const values = [];
    let i = 1;

    if (indicador.EJES_ID) { campos.push(`eje_id = $${i}`); values.push(indicador.EJES_ID); i++; }
    if (indicador.INDICADORES_NOMBRE) { campos.push(`indicadores_nombre = $${i}`); values.push(indicador.INDICADORES_NOMBRE); i++; }
    if (indicador.INDICADORES_DESCRIPCION) { campos.push(`indicadores_descripcion = $${i}`); values.push(indicador.INDICADORES_DESCRIPCION); i++; }

    if (campos.length === 0) return false;
    values.push(indicador.INDICADORES_ID);
    const query = `UPDATE INDICADORES SET ${campos.join(', ')} WHERE indicadores_id = $${i}`;
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  }
}
