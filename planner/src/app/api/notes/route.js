// Notes Routes
// user to interact w notes table get single note

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

//eventually return new data? place back on page using dates and indexing...
//currently just returning created id
export async function GET(req, res){
  //if user has page but no data for date??
  const client = await db.connect();
  let activeDate = new Date();   // set default (should never not get an active date?)
  let note;

  if (req.nextUrl.searchParams) {
      activeDate = new Date(req.nextUrl.searchParams.get('activeDate'));
  }
  let dateNoTimeStr = `${activeDate.getFullYear()}-${activeDate.getMonth()+1}-${activeDate.getDate()}`;

  try {
    //change to json call, nesting status info
    note = await client.sql`
    SELECT note
    FROM notes
    WHERE date = ${dateNoTimeStr}
    `;
      
  } catch (error) {
    console.error('Note not found:', error);
    return NextResponse.json({ message: 'Error' }, { status: 400 })
  } finally {
    await client.end();
  }

  return NextResponse.json( note.rows[0], { status: 201 })
}
