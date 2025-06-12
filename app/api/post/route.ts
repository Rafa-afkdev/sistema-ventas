import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = await createConnection();
        const sql = 'select * from tb_usuario';
        const [posts] = await db.query(sql);
        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error });
    }
}
