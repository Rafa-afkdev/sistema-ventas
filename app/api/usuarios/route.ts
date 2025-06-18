/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
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

// POST - Crear nuevo usuario
export async function POST(request: Request) {
  let connection;
  
  try {
    const body = await request.json();
    const { nombre, apellido, usuario, password, telefono, estado } = body;
    
    // Validaciones del servidor
    if (!nombre || !apellido || !usuario || !password || !telefono) {
      return NextResponse.json(
        { message: 'Todos los campos son obligatorios', field: 'required' },
        { status: 400 }
      );
    }
    
    // Validar longitudes
    if (nombre.length > 30 || apellido.length > 30) {
      return NextResponse.json(
        { message: 'Nombre y apellido no pueden exceder 30 caracteres' },
        { status: 400 }
      );
    }
    
    if (usuario.length > 15 || password.length > 15) {
      return NextResponse.json(
        { message: 'Usuario y contraseña no pueden exceder 15 caracteres' },
        { status: 400 }
      );
    }
    
    if (telefono.length > 15) {
      return NextResponse.json(
        { message: 'El teléfono no puede exceder 15 caracteres' },
        { status: 400 }
      );
    }
    
    connection = await getConnection();
    
    // Verificar si el usuario ya existe
    const [existingUser] = await connection.execute(
      'SELECT idUsuario FROM tb_usuario WHERE usuario = ?',
      [usuario]
    ) as [mysql.RowDataPacket[], any];
    
    if ((existingUser as mysql.RowDataPacket[]).length > 0) {
      return NextResponse.json(
        { message: 'El nombre de usuario ya está registrado', field: 'usuario' },
        { status: 409 }
      );
    }
    
    // Insertar nuevo usuario
    const [result] = await connection.execute<mysql.ResultSetHeader>(
      `INSERT INTO tb_usuario (nombre, apellido, usuario, password, telefono, estado) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, usuario, password, telefono, estado || 1]
    );
    
    return NextResponse.json(
      { 
        message: 'Usuario creado exitosamente',
        idUsuario: (result as mysql.ResultSetHeader).insertId 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    // Manejar errores específicos de MySQL
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'El usuario ya existe', field: 'usuario' },
        { status: 409 }
      );
    }
    
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

// GET - Obtener usuarios (opcional)
export async function GET() {
  let connection;
  
  try {
    connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT idUsuario, nombre, apellido, usuario, telefono, estado FROM tb_usuario ORDER BY idUsuario DESC'
    );
    
    return NextResponse.json(rows);
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
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