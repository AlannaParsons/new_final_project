// GET NOTES for given page
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){
    //const data = req.params
    let notes;
    //            WHERE ${data.email} = email
    
    let id = params.id;
    //5f70f8be-164d-4762-bbdd-9c5c2b46d48b
    console.log('db connect?',id)

    const client = await db.connect();
    try {
        
        notes = await client.sql`
        SELECT *
        FROM notes
        WHERE fk_note_pg = ${id};
        `;
        
        return NextResponse.json( notes.rows, { status: 201 })
        
    } catch (error) {
        console.error('Notes not found:', error);
        return NextResponse.json({ message: 'Error' }, { status: 400 })
    } finally {
        await client.end();
    }

}

// export async function GET(req: Request, { params }, res: Response){
//     const id = params.id
//     let therapist;
//     console.log('api search id:',id)
