// GET NOTES for given page
//----------------------------------
// will need to impliment user id filter

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){
    let notes;
    let id = params.id;        //5f70f8be-164d-4762-bbdd-9c5c2b46d48b - (primary source for testing)
    let month = new Date();   // set default (should never not get an active date?)

    if (req.nextUrl.searchParams) {
        month = new Date(req.nextUrl.searchParams.get('activeDate')).getMonth() + 1;
    }

    const client = await db.connect();
    try {
        
        notes = await client.sql`
        SELECT *
        FROM notes
        WHERE fk_note_pg = ${id}
            AND EXTRACT(MONTH FROM date) = ${month};
        `;

        return NextResponse.json( notes.rows, { status: 201 })
        
    } catch (error) {
        console.error('Notes not found:', error);
        return NextResponse.json({ message: 'Error' }, { status: 400 })
    } finally {
        await client.end();
    }
}
