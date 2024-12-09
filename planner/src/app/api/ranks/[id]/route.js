// Ranks Routes
// user to interact w ranks table
//expected to update singular rank as chnaged on page gived rank id. return entire object, not only id?
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

//patching status in ranks table
export async function PATCH(req, {params}, res){

  let id = params.id;
  const { statusID } = await req.json();
  const client = await db.connect();
  let rankItem;
  console.log('inputs', id, ',', statusID)

  try {
    rankItem = await client.sql`
          UPDATE ranks
          SET fk_status=${statusID}
          WHERE id = ${id}
          RETURNING *;
      `;
      
  } catch (error) {
      console.error('Error updating rank:', error);
      return NextResponse.json({ message: 'Patch Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json(rankItem.rows[0] , { status: 201 })
}