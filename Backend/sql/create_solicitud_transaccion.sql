-- Crear tabla para solicitudes de pago
CREATE TABLE IF NOT EXISTS solicitud_pago (
    id_solicitud SERIAL PRIMARY KEY,
    id_fundacion INTEGER NOT NULL REFERENCES usuario(usuario_id),
    id_admin INTEGER NOT NULL REFERENCES usuario(usuario_id),
    id_reporte INTEGER NOT NULL REFERENCES reporteproyecto(reporteproyecto_id),
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'pagada', 'fallida')),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP,
    fecha_pago TIMESTAMP,
    observaciones TEXT,
    referencia_plux VARCHAR(255),
    enlace_pago TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla para historial de transacciones con Plux
CREATE TABLE IF NOT EXISTS transaccion_plux (
    id_transaccion SERIAL PRIMARY KEY,
    id_solicitud INTEGER NOT NULL REFERENCES solicitud_pago(id_solicitud),
    referencia_plux VARCHAR(255) NOT NULL UNIQUE,
    estado_plux VARCHAR(100) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',
    metodo_pago VARCHAR(100),
    fecha_transaccion TIMESTAMP,
    datos_respuesta JSONB,
    webhook_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_solicitud_pago_fundacion ON solicitud_pago(id_fundacion);
CREATE INDEX IF NOT EXISTS idx_solicitud_pago_estado ON solicitud_pago(estado);
CREATE INDEX IF NOT EXISTS idx_solicitud_pago_fecha ON solicitud_pago(fecha_solicitud);
CREATE INDEX IF NOT EXISTS idx_transaccion_plux_referencia ON transaccion_plux(referencia_plux);
CREATE INDEX IF NOT EXISTS idx_transaccion_plux_solicitud ON transaccion_plux(id_solicitud);

-- Crear función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar timestamp automáticamente
CREATE TRIGGER update_solicitud_pago_updated_at 
    BEFORE UPDATE ON solicitud_pago 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaccion_plux_updated_at 
    BEFORE UPDATE ON transaccion_plux 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
