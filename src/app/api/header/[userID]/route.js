// GET pages user has saved
// 
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){

  let user = params.userID
  //let user = '3958dc9e-712f-4377-85e9-fec4b6a6442a'
  let userPages;

  const client = await db.connect();
  try {
    userPages = await client.sql`
    SELECT *
    FROM pages
    WHERE fk_user = ${user}
    `;
      
  } catch (error) {
      console.error('Pages not found:', error);
      return NextResponse.json({ message: 'Error' }, { status: 400 })
  } finally {
      await client.end();
  }
  
  return NextResponse.json( userPages.rows, { status: 201 })
}
