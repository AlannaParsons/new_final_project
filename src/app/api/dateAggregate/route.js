// Grab all info for date aggrigate page
// currently doesn't pull by user id. may not be necessary w eventual local storage
// get all pages from user, use pages to get individual data from date per page

// new data struct
// 0: {id: #, type: "ranks"
//      data: {
    //     color: null/string, 
    //     completed: null/true, 
    //     fk_status: #,
    //     phrase: null/string,
    //     rank_id: # (fk),
    //     title: "weather
    //  }
//     }
// 1: {id: '#', type: 'goals', 
//      data: Array(
//        {title: 'exercise', goal_id: # , completed: date/null})
//    }
// 2: {id: '#', type: 'notes', 
//      data: {note_id: null, completed: null, note: null}}

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, res){

  const client = await db.connect();
  let activeDate = new Date();   // set default (should never not get an active date?)
  // reconsider
  let structuredReturn = [];

  if (req.nextUrl.searchParams) {
      activeDate = new Date(req.nextUrl.searchParams.get('activeDate'));
  }
  let dateNoTimeStr = `${activeDate.getFullYear()}-${activeDate.getMonth()+1}-${activeDate.getDate()}`;

  try {
    //without user pages.. how do calls know? i dont know. magic. further testing needed

    // expect single data point per rank page
    // returns all pages, even if no associated data. 

    let rankdata = await client.sql`
      SELECT pages.id, type, pages.title, jsonb_agg(jsonb_build_object(
        'rank_id', ranks.id, 
        'fk_status', fk_status, 
        'completed', date,
        'color', color,
        'phrase', phrase
      )) data
      FROM pages 
      LEFT JOIN ranks ON ranks.fk_rank_pg = pages.id AND date = ${dateNoTimeStr}
      LEFT JOIN ranksettings ON fk_status = ranksettings.id
      WHERE type = 'ranks' 
      GROUP BY pages.id 
    `;

    let notedata = await client.sql`
      SELECT pages.id, type, pages.title, jsonb_agg(jsonb_build_object(
        'note_id', notes.id , 
        'completed', date, 
        'note', note
      )) data
      FROM pages
      LEFT JOIN notes ON notes.fk_note_pg = pages.id AND date = ${dateNoTimeStr}
      WHERE type = 'notes' 
      GROUP BY pages.id
    `;

    let goalsdata = await client.sql`
      SELECT pages.id, type, pages.title, jsonb_agg(jsonb_build_object(
        'goal_id', goals.id, 
        'title', goals.title, 
        'completed', goalcompletion.date
      )) data
      FROM pages
      LEFT JOIN goals ON goals.fk_goal_pg = pages.id
      LEFT JOIN goalcompletion ON goals.id = fk_goal AND date = ${dateNoTimeStr}
      WHERE type = 'goals' 
      GROUP BY pages.id
    `;
  
    // if data put into data structure? likely not necessary
    structuredReturn.push(...rankdata.rows)
    structuredReturn.push(...goalsdata.rows);
    structuredReturn.push(...notedata.rows);
  
  } catch (error) {
    console.error('Aggrigate not found:', error);
    return NextResponse.json({ message: 'Error' }, { status: 400 })
  } finally {
    await client.end();
  }

  return NextResponse.json( structuredReturn, { status: 201 })
}