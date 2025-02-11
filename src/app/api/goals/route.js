// Goals Routes
// user to interact w goals table
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

//add new goal to user
//not done at all
export async function POST(req, res){

  //could be set here instead of sent? acts as placeholder anyways
  const {id, title} = await req.json();
  const client = await db.connect();
  let createdId;

  try {
      
    createdId = await client.sql`
    INSERT INTO goals (fk_goal_pg, title)
    VALUES (${id}, ${title})
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

//patching title in goals table
//should i impliment deterministic patching???? patching title or completion array
//no return necessary?
export async function PATCH(req, res){
  //const id = params.id; title completion array?

  const {id, title} = await req.json();
  const client = await db.connect();
  let goal;

  try {
    goal = await client.sql`
          UPDATE goals
          SET title=${title}
          WHERE id = ${id}
          RETURNING id;
      `;
      
  } catch (error) {
      console.error('Error updating goal:', error);
      return NextResponse.json({ message: 'Patch Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json({ message: goal }, { status: 201 })
}