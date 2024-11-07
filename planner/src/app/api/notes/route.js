// GET NOTES
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, res){
    //const data = req.params
    let notes;
    //            WHERE ${data.email} = email
    //console.log('db connect?',data)

    const client = await db.connect();
    try {
        
        
        notes = await client.sql`
        SELECT *
        FROM notes
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
