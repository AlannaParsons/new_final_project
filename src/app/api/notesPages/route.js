// notes page

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');

export async function POST(req, res){

  const {user_id, title, data} = await req.json();
  const client = await db.connect();
  let pageCreated;

  try {
    pageCreated = await client.sql`
      INSERT INTO pages (fk_user, title, type)
      VALUES (${user_id}, ${title}, 'notes' )
      RETURNING *
    `;
      
  } catch (error) {
      console.error('Error posting notes page:', error);
      return NextResponse.json({ message: 'Post Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json( pageCreated.rows , { status: 201 })
}
