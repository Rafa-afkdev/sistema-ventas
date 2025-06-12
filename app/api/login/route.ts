/* eslint-disable @typescript-eslint/no-explicit-any */
import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { idUsuario, password } = await request.json();
        if (!idUsuario || !password) {
            return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
        }
        const db = await createConnection();
        const sql = 'SELECT * FROM tb_usuario WHERE idUsuario = ? AND password = ?';
        const [rows]: any = await db.query(sql, [idUsuario, password]);
        if (rows.length === 0) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
        }
        // Puedes devolver más datos del usuario si lo deseas
        return NextResponse.json({ success: true, usuario: rows[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}
