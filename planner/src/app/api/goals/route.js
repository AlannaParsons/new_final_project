// Goals Routes
// user to interact w goals table
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, res){
  //if user has page but no data for date??
  const client = await db.connect();
  let activeDate = new Date();   // set default (should never not get an active date?)
  let goal;

  if (req.nextUrl.searchParams) {
      activeDate = new Date(req.nextUrl.searchParams.get('activeDate'));
  }
  let dateNoTimeStr = `${activeDate.getFullYear()}-${activeDate.getMonth()+1}-${activeDate.getDate()}`;

  try {
    //returns too much data?
    // SELECT jsonb_agg(js_object) goalList
    // FROM ( 
    //     SELECT
    //         jsonb_build_object(
    //             'id', id,
    //             'fk_goal_pg', fk_goal_pg,
    //             'title', title,
    //             'completion', jsonb_agg(goalcompletion)
    //         ) js_object
    //     FROM ( 
    //         SELECT
    //             goals.*,
    //             jsonb_build_object(
    //                 'date', goalcompletion.date
    //             ) goalcompletion
    //         FROM goals
    //         LEFT JOIN goalcompletion ON goals.id = fk_goal 
    //             AND date = ${dateNoTimeStr}
    //         ) goalcompletion 
    //     GROUP BY goalcompletion.id, goalcompletion.title, goalcompletion.fk_goal_pg
    //     ) goalcompletion 



    // strips goals w null id/title?
    goal = await client.sql`
    SELECT
    goals.*,
    goalcompletion.date AS completed
    FROM goals
    LEFT JOIN goalcompletion ON goals.id = fk_goal 
      AND date =  ${dateNoTimeStr}
    `;
      
  } catch (error) {
    console.error('Goal not found:', error);
    return NextResponse.json({ message: 'Error' }, { status: 400 })
  } finally {
    await client.end();
  }

  return NextResponse.json( goal.rows, { status: 201 })
}


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