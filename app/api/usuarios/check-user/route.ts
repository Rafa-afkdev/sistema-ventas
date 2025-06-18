import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tu_base_de_datos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear conexión a la base de datos
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw error;
  }
}

// GET - Verificar si un usuario existe
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const usuario = searchParams.get('usuario');
    
    if (!usuario) {
      return NextResponse.json(
        { message: 'Usuario requerido' },
        { status: 400 }
      );
    }
    
    connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM tb_usuario WHERE usuario = ?',
      [usuario]
    );
    
    const exists = Array.isArray(rows) && rows.length > 0 && (rows[0] as { count: number }).count > 0;
    
    return NextResponse.json({ exists });
    
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}