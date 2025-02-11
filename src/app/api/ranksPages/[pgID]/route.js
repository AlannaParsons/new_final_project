// GET RANKS for given page id
//----------------------------------
// will need to impliment user id filter
//should return data in date order maybe?
//rank ids are iterative. uuid overkill?

import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){
    let ranks, rankLegend;
    let pgID = params.pgID;        //6a54003e-8260-4245-b073-221ca81f6c66 - (primary source for testing)

    const client = await db.connect();
    let month = new Date();   // set default (should never not get an active date?)

    if (req.nextUrl.searchParams) {
        month = new Date(req.nextUrl.searchParams.get('activeDate')).getMonth() + 1;
    }

// returns nested data... cant seem to strip unnessecary data
//     -- SELECT
// --     json_build_object(
// --         'rank_id', ranks.id,
// --         'fk_rank_pg', ranks.fk_rank_pg,
// --         'date', date,
// --         'status', ranksettings
// --     ) js_object
// --     FROM ranks 
// --     JOIN ranksettings ON fk_status = ranksettings.id
    try {
        //change to json call, nesting status info
        ranks = await client.sql`
        SELECT ranks.id AS rank_id, date, fk_status, color
        FROM ranks
        JOIN ranksettings ON fk_status = ranksettings.id
        WHERE ranks.fk_rank_pg = ${pgID} AND EXTRACT(MONTH FROM date) = ${month}
        `;

        rankLegend = await client.sql`
        SELECT id, rank_int, color, phrase
        FROM ranksettings
        WHERE fk_rank_pg = ${pgID}
        `;
   
    } catch (error) {
        console.error('Ranks not found:', error);
        return NextResponse.json({ message: 'Error' }, { status: 400 })
    } finally {
        await client.end();
    }

    return NextResponse.json({ ranks: ranks.rows, legend: rankLegend.rows, status: 201 })
}
