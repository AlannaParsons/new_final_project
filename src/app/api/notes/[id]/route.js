// Notes Routes
// user to interact w notes table w singular note id

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

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