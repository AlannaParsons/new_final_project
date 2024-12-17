// Create _ tables within db, seed all
//
// redesign to stak all pages into one table
// var char vs text?
const { db } = require('@vercel/postgres');
const {
  users, 
  pages,
  notes, 
  goals, goalCompletions,
  rankingUnit, rankSettings
} = require('../src/utils/seedData.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    //await client.sql`DROP TABLE users`
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    //Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, user_name, password)
        VALUES (${user.id}, ${user.userName}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedPages(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS pages (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        fk_user UUID DEFAULT uuid_generate_v4(), 
          constraint fk_user_pages
          foreign key (fk_user) 
          REFERENCES users(id),
        type TEXT NOT NULL,
        title TEXT
      );
    `;

    console.log(`Created "pages" table`);

    const insertedPages = await Promise.all(
      pages.map(async (page) => {
        return client.sql`
        INSERT INTO pages (id, fk_user, type, title)
        VALUES (${page.id}, ${page.fk_user}, ${page.type}, ${page.title})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedPages.length} pages`);

    return {
      createTable,
      pages: insertedPages,
    };
  } catch (error) {
    console.error('Error seeding pages:', error);
    throw error;
  }
}

async function seedNotes(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  //note may be resricted <255
  const createNotesTable = await client.sql`
    CREATE TABLE IF NOT EXISTS notes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      fk_note_pg UUID DEFAULT uuid_generate_v4(), 
        constraint fk_notes_pages
        foreign key (fk_note_pg) 
        REFERENCES pages(id),
      date DATE,
      note VARCHAR(255)
    );
    `;
    console.log(`Created "notes" table`);

    const insertedNotes = await Promise.all(
      notes.map(async (note) => {
        return client.sql`
        INSERT INTO notes (id, fk_note_pg, date, note)
        VALUES (${note.id}, ${note.fk_note_page}, ${note.date}, ${note.note} )
        ;
      `;
      }),
    );
    console.log(`Seeded ${insertedNotes.length} notes`);

    return {
      createNotesTable,
      savedNotes: insertedNotes,
    };
  } catch (error) {
    console.error('Error seeding notes:', error);
    throw error;
  }
}

async function seedGoals(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createGoalsTable = await client.sql`
      CREATE TABLE IF NOT EXISTS goals (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        fk_goal_pg UUID DEFAULT uuid_generate_v4(), 
          constraint fk_goals_pages
          foreign key (fk_goal_pg) 
          REFERENCES pages(id),
        title VARCHAR(255)
      );
    `;

    console.log(`Created "goals" table`);

    const createCompletionTable = await client.sql`
      CREATE TABLE IF NOT EXISTS goalCompletion (
        id SERIAL PRIMARY KEY,
        fk_goal UUID DEFAULT uuid_generate_v4(), 
          constraint fk_goals_completed
          foreign key (fk_goal) 
          REFERENCES goals(id),
        date DATE
      );
    `;

    console.log(`Created "goal completion" table`);

    // Insert data into the "goals" table
    const insertedGoals = await Promise.all(
      goals.map(async (goal) => {
        return client.sql`
        INSERT INTO goals (id, fk_goal_pg, title)
        VALUES (${goal.id}, ${goal.fk_goal_pg}, ${goal.title} )
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedGoals.length} goals`);

    // Insert data into the "goalCompletion" table
    const insertedGoalStatus = await Promise.all(
      goalCompletions.map(async (completed) => {
        return client.sql`
        INSERT INTO goalCompletion (fk_goal, date)
        VALUES (${completed.goaltype_id}, ${completed.date} )
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedGoalStatus.length} goal completion`);

    return {
      createGoalsTable,
      createCompletionTable,
      savedGoals: insertedGoals,
      savedGoalStatus: insertedGoalStatus
    };
  } catch (error) {
    console.error('Error seeding goals:', error);
    throw error;
  }
}

async function seedRanking(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createSettingsTable = await client.sql`
      CREATE TABLE IF NOT EXISTS rankSettings (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        fk_rank_pg UUID DEFAULT uuid_generate_v4(), 
          constraint fk_page_settings
          foreign key (fk_rank_pg) 
          REFERENCES pages(id),
        rank_int INT,
        color VARCHAR(255),
        phrase VARCHAR(255)
      );
    `;

    console.log(`Created "rank settings" table`);

    const createRanksTable = await client.sql`
      CREATE TABLE IF NOT EXISTS ranks (
        id SERIAL PRIMARY KEY,
        fk_rank_pg UUID DEFAULT uuid_generate_v4(), 
          constraint fk_page_unit
          foreign key (fk_rank_pg) 
          REFERENCES pages(id),
        fk_status UUID DEFAULT uuid_generate_v4(), 
          constraint fk_rank_setting
          foreign key (fk_status) 
          REFERENCES rankSettings(id),
        date DATE
      );
    `;

    console.log(`Created "rank" table`);
    
    const insertedRankSettings = await Promise.all(
      rankSettings.map(async (rankSet) => {
        return client.sql`
        INSERT INTO rankSettings (id, fk_rank_pg, rank_int, color, phrase)
        VALUES (${rankSet.id}, ${rankSet.rank_tbl}, ${rankSet.rank_int}, ${rankSet.color}, ${rankSet.phrase})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedRankSettings.length} rank settings`);

    const insertedRanks = await Promise.all(
      rankingUnit.map(async (rankUnit) => {
        return client.sql`
        INSERT INTO ranks ( fk_rank_pg, fk_status, date)
        VALUES ( ${rankUnit.rank_tbl}, ${rankUnit.rank_set},  ${rankUnit.date})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedRanks.length} ranks`);

    return {
      createSettingsTable,
      createRanksTable,
      savedRankSettings: insertedRankSettings,
      savedRanks: insertedRanks,
    };
  } catch (error) {
    console.error('Error seeding rankings:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedPages(client);
  await seedNotes(client);
  await seedGoals(client);
  await seedRanking(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
