// Goals Completion Table

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

//include title and id
//not sending status to db. not necessary
export async function POST(req, res){

  const {id, date} = await req.json();
  const client = await db.connect();
  let createdId;

  try {
      
    createdId = await client.sql`
    INSERT INTO goalCompletion (fk_goal, date)
    VALUES (${id}, ${date})
    RETURNING id;
    `;
      
  } catch (error) {
      console.error('Error updating goal completion:', error);
      return NextResponse.json({ message: 'Post Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json({ message: createdId }, { status: 201 })
}