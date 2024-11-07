// GET Goals
// will need to sort by date and user id at some point, but this is enough for testing
import { NextResponse } from "next/server";
const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

export async function GET(req, res){
    let goals;

    const client = await db.connect();
    try {

        //using json to aggrigate data
        //https://stackoverflow.com/questions/38458318/returning-postgres-nested-json-array
        
        goals = await client.sql`
            SELECT jsonb_agg(js_object) goalList
                FROM ( 
                    SELECT
                        jsonb_build_object(
                            'title', title,
                            'completion', jsonb_agg(goalcompletion)
                        ) js_object
                    FROM ( 
                        SELECT
                            goals.*,
                            jsonb_build_object(
                                'status', goalcompletion.status,
                                'date', goalcompletion.date
                            ) goalcompletion
                        FROM goals
                        JOIN goalcompletion ON goals.id = fk_goal 
                        ) goalcompletion 
                    GROUP BY goalcompletion.id, goalcompletion.title
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
