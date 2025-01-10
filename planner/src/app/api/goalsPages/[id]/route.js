// GET Goals
// will need to sort by date and user id at some point, but this is enough for testing
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, {params}, res){
    let goals;
    let month = 0;
    let activeDate = new Date(); // attempt error handle? back end should be setting date?
    let id = params.id; //'f348abf8-6a35-4f4f-a275-bf4aab188f1d'

    if (req.nextUrl.searchParams) {
        activeDate = new Date(req.nextUrl.searchParams.get('activeDate'));
        month = activeDate.getMonth() + 1;
    }
    
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
