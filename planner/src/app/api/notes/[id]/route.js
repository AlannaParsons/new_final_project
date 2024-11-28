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
  console.log('post recieved', notes)

  try {

    insertedNotes = await Promise.all(
      notes.map(async (note) => {
        return client.sql`
        INSERT INTO notes (fk_note_pg, date, note)
        VALUES (${id}, ${note.date}, ${note.note} )
        RETURNING id;
        ;
      `;
      }),
    );
      
  } catch (error) {
      console.error('Error updating goal completion:', error);
      return NextResponse.json({ message: 'Post Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json({ message: insertedNotes }, { status: 201 })
}

export async function PATCH(req, res){
  //const id = params.id; 
  

  const {notes} = await req.json();
  const client = await db.connect();
  let patchedNotes;
  console.log('patchrecieved', notes)

  try {
    patchedNotes = await Promise.all(
      notes.map(async (note) => {
        return client.sql`
        UPDATE notes
        SET note=${note.note}
        WHERE id = ${note.id}
        RETURNING id;
        ;
      `;
      }),
    );
      
  } catch (error) {
      console.error('Error updating goal:', error);
      return NextResponse.json({ message: 'Patch Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json({ message: patchedNotes }, { status: 201 })
}