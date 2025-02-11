// Ranks Routes
// user to interact w ranks table
//expected to update singular rank as chnaged on page gived rank id
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

//add new rank unit to user
export async function POST(req, res){

  //could be set here instead of sent? acts as placeholder anyways
  const client = await db.connect();
  const {pgID, date, statusID} = await req.json();
  let createdItem;

  try {
      
    createdItem = await client.sql`
    INSERT INTO ranks (fk_rank_pg, date, fk_status)
    VALUES (${pgID}, ${date}, ${statusID})
    RETURNING *;
    `;
      
  } catch (error) {
      console.error('Error updating rank status:', error);
      return NextResponse.json({ message: 'Post Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json(createdItem.rows[0], { status: 201 })
}