import pool from '../config/db.js';

export class TransaccionPluxRepository {
  async create(transaccion) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(id_transaccion), 0) + 1 AS nextId FROM transaccion_plux`);
    const nextId = rowsMax[0].nextid;
    const query = `
      INSERT INTO transaccion_plux (id_transaccion, id_solicitud, referencia_plux, estado_plux, monto, moneda, metodo_pago, fecha_transaccion, datos_respuesta, webhook_data)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;
    const values = [
      nextId,
      transaccion.ID_SOLICITUD,
      transaccion.REFERENCIA_PLUX,
      transaccion.ESTADO_PLUX,
      transaccion.MONTO,
      transaccion.MONEDA || 'USD',
      transaccion.METODO_PAGO,
      transaccion.FECHA_TRANSACCION,
      transaccion.DATOS_RESPUESTA,
      transaccion.WEBHOOK_DATA
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM transaccion_plux ORDER BY id_transaccion`);
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT * FROM transaccion_plux WHERE id_transaccion = $1`, [id]);
    return rows;
  }

  async buscarPorReferencia(ref) {
    const { rows } = await pool.query(`SELECT * FROM transaccion_plux WHERE referencia_plux = $1`, [ref]);
    return rows;
  }

  async eliminar(id) {
    const { rowCount } = await pool.query(`DELETE FROM transaccion_plux WHERE id_transaccion = $1`, [id]);
    return rowCount > 0;
  }

  async actualizar(transaccion) {
    const campos = [];
    const values = [];
    let i = 1;
    const maybe = (field, val) => { if (val !== undefined) { campos.push(`${field} = $${i}`); values.push(val); i++; } };
    maybe('id_solicitud', transaccion.ID_SOLICITUD);
    maybe('referencia_plux', transaccion.REFERENCIA_PLUX);
    maybe('estado_plux', transaccion.ESTADO_PLUX);
    maybe('monto', transaccion.MONTO);
    maybe('moneda', transaccion.MONEDA);
    maybe('metodo_pago', transaccion.METODO_PAGO);
    maybe('fecha_transaccion', transaccion.FECHA_TRANSACCION);
    maybe('datos_respuesta', transaccion.DATOS_RESPUESTA);
    maybe('webhook_data', transaccion.WEBHOOK_DATA);

    if (campos.length === 0) return false;
    values.push(transaccion.ID_TRANSACCION);
    const query = `UPDATE transaccion_plux SET ${campos.join(', ')} WHERE id_transaccion = $${i}`;
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  }
}
