// Notes Routes
// user to interact w notes table

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

export async function PATCH(req, res){
  //const id = params.id; 
  
  const {notes} = await req.json();
  const client = await db.connect();
  let patchedNotes;
  let response = [];

  try {
    patchedNotes = await Promise.all(
      notes.map(async (note) => {
        return client.sql`
        UPDATE notes
        SET note=${note.note}
        WHERE id = ${note.id}
        RETURNING *;
        ;
      `;
      }),
    );

    //structure response
    patchedNotes.map((resp) => {
      response.push(resp.rows[0])
    })
      
  } catch (error) {
      console.error('Error updating notes:', error);
      return NextResponse.json({ message: 'Patch Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json( response , { status: 201 })
}