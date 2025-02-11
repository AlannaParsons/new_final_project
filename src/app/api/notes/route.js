// Notes Routes
// user to interact w notes table get single note

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

//eventually return new data? place back on page using dates and indexing...
//currently just returning created id
export async function POST(req, res){

  const {id, notes} = await req.json();
  const client = await db.connect();
  let insertedNotes;
  let response = [];

  try {

    insertedNotes = await Promise.all(
      notes.map(async (note) => {
        return client.sql`
        INSERT INTO notes (fk_note_pg, date, note)
        VALUES (${id}, ${note.date}, ${note.note} )
        RETURNING *;
        ;
      `;
      }),
    );

    //structure response
    insertedNotes.map((resp) => {
      response.push(resp.rows[0])
    })
      
  } catch (error) {
      console.error('Error posting notes:', error);
      return NextResponse.json({ message: 'Post Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json( response , { status: 201 })
}
