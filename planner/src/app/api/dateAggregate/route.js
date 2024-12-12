// Grab all info for date aggrigate page
// currently doesn't pull by user id. may not be necessary w eventual local storage
// get all pages from user, use pages to get individual data from date per page
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

// get rank unit
export async function GET(req, res){

  const client = await db.connect();
  let activeDate = new Date();   // set default (should never not get an active date?)
  // reconsider
  let structuredReturn = {}
  

  if (req.nextUrl.searchParams) {
      activeDate = new Date(req.nextUrl.searchParams.get('activeDate'));
  }
  let dateNoTimeStr = `${activeDate.getFullYear()}-${activeDate.getMonth()+1}-${activeDate.getDate()}`;

  try {
    //without user pages.. how do calls know? i dont know. magic. further testing needed

    // let notesTemp = await client.sql`
    // SELECT *
    // FROM notesPages
    // `;

    // let ranksTemp = await client.sql`
    // SELECT *
    // FROM rankPages
    // `;

    // let goalsTemp = await client.sql`
    // SELECT *
    // FROM goalsPages
    // `;

    // const [notePage, rankPage, goalsPage] = await Promise.all([notesTemp, ranksTemp, goalsTemp])

    // expect single data point per rank page
    // returns all pages, even if no associated data. 

    let rankdata = await client.sql`
      SELECT rankpages.id, rankpages.title, ranks.id AS rank_id, fk_status, date AS completed, color, phrase
      FROM rankpages
      LEFT JOIN ranks ON ranks.fk_rank_pg = rankpages.id
        AND date = ${dateNoTimeStr}
      LEFT JOIN ranksettings ON fk_status = ranksettings.id;
    `;

    let notedata = await client.sql`
      SELECT notespages.id, notes.id AS note_id, date AS completed, note
      FROM notespages
      LEFT JOIN notes ON notes.fk_note_pg = notespages.id
      AND date = ${dateNoTimeStr}
    `;

    //current version returns one piece of data per goal page, each goal item is obj in goals array
    let goalsdata = await client.sql`
      SELECT goalspages.id, jsonb_agg(jsonb_build_object(
          'goal_id', goals.id, 
          'title', title, 
          'completed', goalcompletion.date
        )) goals
      FROM goalspages
      LEFT JOIN goals ON goals.fk_goal_pg = goalspages.id
      LEFT JOIN goalcompletion ON goals.id = fk_goal 
      AND date = ${dateNoTimeStr}
      GROUP BY goalspages.id
    `;
  
    // if data put into data structure? likely not necessary
    structuredReturn['ranks'] = rankdata.rows;
    structuredReturn['goals'] = goalsdata.rows;
    structuredReturn['notes'] = notedata.rows;
  
  } catch (error) {
    console.error('Aggrigate not found:', error);
    return NextResponse.json({ message: 'Error' }, { status: 400 })
  } finally {
    await client.end();
  }

  return NextResponse.json( structuredReturn, { status: 201 })
}