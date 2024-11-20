// GET Goals
// will need to sort by date and user id at some point, but this is enough for testing
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){
    let goals;
    let month = 11;
    //get user iD!!! OR GOAL PAGE ID
    if (req.nextUrl.searchParams) {
        console.log('back end check', req.nextUrl.searchParams.activeDate)
        console.log('back end check', req.nextUrl.searchParams);
        let month = new Date(req.nextUrl.searchParams.activeDate).getMonth() + 1;
    }
    //
    let id = params.id; //'f348abf8-6a35-4f4f-a275-bf4aab188f1d'



    const client = await db.connect();
    try {

        //using json to aggrigate data
        //https://stackoverflow.com/questions/38458318/returning-postgres-nested-json-array
        
        goals = await client.sql`
            SELECT jsonb_agg(js_object) goalList
                FROM ( 
                    SELECT
                        jsonb_build_object(
                            'id', id,
                            'fk_goal_pg', fk_goal_pg,
                            'title', title,
                            'completion', jsonb_agg(goalcompletion)
                        ) js_object
                    FROM ( 
                        SELECT
                            goals.*,
                            jsonb_build_object(
                                'date', goalcompletion.date
                            ) goalcompletion
                        FROM goals
                        LEFT JOIN goalcompletion ON goals.id = fk_goal 
                        AND fk_goal_pg = ${id}
                        AND EXTRACT(MONTH FROM goalcompletion.date) = ${month}
                        ) goalcompletion 
                    GROUP BY goalcompletion.id, goalcompletion.title, goalcompletion.fk_goal_pg
                    ) goalcompletion 
        `

        return NextResponse.json( goals.rows[0], { status: 201 })
        
    } catch (error) {
        console.error('Goal not found:', error);
        return NextResponse.json({ message: 'Error' }, { status: 400 })
    } finally {
        await client.end();
    }
}

export async function POST(req, res){
    const data = await req.json();
    // change how to store full name???
    const fullName = `${data.ln}, ${data.fn}`
    let createdId = null;

    const client = await db.connect();
    try {
        
        const hashedPassword = await bcrypt.hash(data.password, 10);
        createdId = await client.sql`
        INSERT INTO accounts (name, email, password, address, phone_number, website)
        VALUES (${fullName}, ${data.email}, ${hashedPassword},
            ${data.address}, ${data.phone_number}, ${data.website})
        RETURNING id;
        `;
        
    } catch (error) {
        console.error('Error inserting new account:', error);
        return NextResponse.json({ message: 'Creation Error' }, { status: 400 })
    } finally {
        await client.end();
    }

    return NextResponse.json({ message: 'Account Created' }, { status: 201 })
}

export async function PATCH(req, { params }, res){
  //const id = params.id;
  let account;

  const data = await req.json();
  const client = await db.connect();

  console.log('inside patch api:', data, params)

  try {
      
      // account = await client.sql`
      //     UPDATE accounts
      //     SET name=${data.name}, phone_number=${data.phone_number}, 
      //         email=${data.email}, address=${data.address}, website=${data.website}
      //     WHERE id = ${id};
      // `;
      
  } catch (error) {
      console.error('Error updating account:', error);
      return NextResponse.json({ message: 'Patch Error' }, { status: 400 })
  } finally {
      await client.end();
  }

  return NextResponse.json({ message: 'Account Updated' }, { status: 201 })
}