// GET pages user has saved
// REWRITE. SINGLE QUERY w union :( 
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){
  //how to send data back to front end?
  //  notes: [pg id array], etc...
  //  Type: notes, page(s?): [pg id array], etc...

    //let user = params.user

    let temp = [];

    const client = await db.connect();
    try {
      //seperate calls?
      // do a join instead...
        
        let notesTemp = await client.sql`
        SELECT *
        FROM notesPages
        `;
        temp.push(...notesTemp.rows.map(row => ({ ...row, type: 'notes' })));

        let ranksTemp = await client.sql`
        SELECT *
        FROM rankPages
        `;
        temp.push(...ranksTemp.rows.map(row => ({ ...row, type: 'ranks' })));

        let goalsTemp = await client.sql`
        SELECT *
        FROM goalsPages
        `;
        temp.push(...goalsTemp.rows.map(row => ({ ...row, type: 'goals' })));

        return NextResponse.json( temp, { status: 201 })
        
    } catch (error) {
        console.error('Notes not found:', error);
        return NextResponse.json({ message: 'Error' }, { status: 400 })
    } finally {
        await client.end();
    }

}
//goalpages rankpages notespages