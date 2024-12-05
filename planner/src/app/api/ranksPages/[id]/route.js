// GET RANKS for given page id
//----------------------------------
// will need to impliment user id filter

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){
    let notes;
    let id = params.id;        //6a54003e-8260-4245-b073-221ca81f6c66 - (primary source for testing)
    //let month = new Date();   // set default (should never not get an active date?)

    // if (req.nextUrl.searchParams) {
    //     month = new Date(req.nextUrl.searchParams.get('activeDate')).getMonth() + 1;
    // }

    const client = await db.connect();
    try {
        
        notes = await client.sql`
        SELECT *
        FROM ranks
        JOIN ranksettings ON fk_status = ranksettings.id
        WHERE ranks.fk_rank_pg = ${id}
        `;

        return NextResponse.json( notes.rows, { status: 201 })
        
    } catch (error) {
        console.error('Notes not found:', error);
        return NextResponse.json({ message: 'Error' }, { status: 400 })
    } finally {
        await client.end();
    }
}
