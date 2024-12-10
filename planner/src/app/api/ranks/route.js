// Ranks Routes
// user to interact w ranks table
//expected to update singular rank as chnaged on page gived rank id
// GET IS ONLY HAPPY PATH
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, res){
  //if user has page but no data for date??
  const client = await db.connect();
  let activeDate = new Date();   // set default (should never not get an active date?)
  let rank;

  if (req.nextUrl.searchParams) {
      activeDate = new Date(req.nextUrl.searchParams.get('activeDate'));
  }
  let dateNoTimeStr = `${activeDate.getFullYear()}-${activeDate.getMonth()+1}-${activeDate.getDate()}`;

  try {
    //change to json call, nesting status info
    rank = await client.sql`
    SELECT ranks.id AS rank_id, date, fk_status, color, phrase
    FROM ranks
    JOIN ranksettings ON fk_status = ranksettings.id
    WHERE ranks.date = ${dateNoTimeStr}
    `;
      
  } catch (error) {
    console.error('Rank not found:', error);
    return NextResponse.json({ message: 'Error' }, { status: 400 })
  } finally {
    await client.end();
  }

  return NextResponse.json( rank.rows[0], { status: 201 })
}

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