import pool from '../config/db.js';

export class SolicitudPagoRepository {
  async create(solicitud) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(id_solicitud), 0) + 1 AS nextId FROM solicitud_pago`);
    const nextId = rowsMax[0].nextid;
    const query = `
      INSERT INTO solicitud_pago (id_solicitud, id_fundacion, id_admin, id_reporte, monto, descripcion, estado, fecha_solicitud, fecha_aprobacion, fecha_pago, observaciones, referencia_plux, enlace_pago)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
    `;
    const values = [
      nextId,
      solicitud.ID_FUNDACION,
      solicitud.ID_ADMIN,
      solicitud.ID_REPORTE,
      solicitud.MONTO,
      solicitud.DESCRIPCION,
      solicitud.ESTADO || 'pendiente',
      solicitud.FECHA_SOLICITUD,
      solicitud.FECHA_APROBACION,
      solicitud.FECHA_PAGO,
      solicitud.OBSERVACIONES,
      solicitud.REFERENCIA_PLUX,
      solicitud.ENLACE_PAGO
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM solicitud_pago ORDER BY id_solicitud`);
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT * FROM solicitud_pago WHERE id_solicitud = $1`, [id]);
    return rows;
  }

  async eliminar(id) {
    const { rowCount } = await pool.query(`DELETE FROM solicitud_pago WHERE id_solicitud = $1`, [id]);
    return rowCount > 0;
  }

  async actualizar(solicitud) {
    const campos = [];
    const values = [];
    let i = 1;
    const maybe = (field, val) => { if (val !== undefined) { campos.push(`${field} = $${i}`); values.push(val); i++; } };
    maybe('id_fundacion', solicitud.ID_FUNDACION);
    maybe('id_admin', solicitud.ID_ADMIN);
    maybe('id_reporte', solicitud.ID_REPORTE);
    maybe('monto', solicitud.MONTO);
    maybe('descripcion', solicitud.DESCRIPCION);
    maybe('estado', solicitud.ESTADO);
    maybe('fecha_solicitud', solicitud.FECHA_SOLICITUD);
    maybe('fecha_aprobacion', solicitud.FECHA_APROBACION);
    maybe('fecha_pago', solicitud.FECHA_PAGO);
    maybe('observaciones', solicitud.OBSERVACIONES);
    maybe('referencia_plux', solicitud.REFERENCIA_PLUX);
    maybe('enlace_pago', solicitud.ENLACE_PAGO);

    if (campos.length === 0) return false;
    values.push(solicitud.ID_SOLICITUD);
    const query = `UPDATE solicitud_pago SET ${campos.join(', ')} WHERE id_solicitud = $${i}`;
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  }
}
