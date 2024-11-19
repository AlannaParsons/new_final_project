// ranking allows for multiple ranking pages. redesign to allow for goals and 
// notes as well. will necessitate vast renaming of db
const { db } = require('@vercel/postgres');
const {
  users, 
  notesPages, notes, 
  goalsPages, goals, goalCompletions,
  rankPages, rankingUnit, rankSettings
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

async function seedNotes(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createNotesPages = await client.sql`
    CREATE TABLE IF NOT EXISTS notesPages (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      fk_user UUID DEFAULT uuid_generate_v4(), 
        constraint fk_user_goalsPG
        foreign key (fk_user) 
        REFERENCES users(id)
    );
  `;
  
  console.log(`Created "notesPages" table`);

  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  //note may be resricted <255
  const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS notes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      fk_note_pg UUID DEFAULT uuid_generate_v4(), 
        constraint fk_notes_on_pg
        foreign key (fk_note_pg) 
        REFERENCES notesPages(id),
      date DATE,
      note VARCHAR(255)
    );
  `;

    console.log(`Created "notes" table`);

    // Insert data into the "notesPages" table
    const insertedNotesPages = await Promise.all(
      notes.map(async (notePg) => {
        return client.sql`
        INSERT INTO notesPages (id, fk_user)
        VALUES (${notePg.id}, ${notePg.fk_user} )
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );
    console.log(`Seeded ${insertedNotesPages.length} notes`);

    // Insert data into the "notes" table
    const insertedNotes = await Promise.all(
      notes.map(async (note) => {
        return client.sql`
        INSERT INTO notes (id, fk_note_pg, date, note)
        VALUES (${note.id}, ${note.fk_note_pg}, ${note.date}, ${note.note} )
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedNotes.length} notes`);

    return {
      createTable,
      savedNotesPage: insertedNotesPages,
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
    const createGoalsPages = await client.sql`
    CREATE TABLE IF NOT EXISTS goalsPages (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      fk_user UUID DEFAULT uuid_generate_v4(), 
        constraint fk_user_goalsPG
        foreign key (fk_user) 
        REFERENCES users(id)
    );
  `;

  console.log(`Created "goal completion" table`);

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS goals (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        fk_goal_pg UUID DEFAULT uuid_generate_v4(), 
          constraint fk_goals_goalPG
          foreign key (fk_goal_pg) 
          REFERENCES goalsPages(id),
        title VARCHAR(255)
      );
    `;

    console.log(`Created "goals" table`);

    const createSubTable = await client.sql`
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

    // Insert data into the "goalsPages" table
    const insertedGoalsPages = await Promise.all(
      goalsPages.map(async (goalPage) => {
        return client.sql`
        INSERT INTO goalsPages (id, fk_user)
        VALUES (${goalPage.id}, ${goalPage.fk_user})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedGoalsPages.length} goals pages`);

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
      createGoalsPages,
      createTable,
      createSubTable,
      savedGoalsPages: insertedGoalsPages,
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
    //await client.sql`DROP TABLE users`
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    //ranking is a ranking page. rename?
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS rankPages (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        fk_user UUID DEFAULT uuid_generate_v4(), 
          constraint fk_user_ranking
          foreign key (fk_user) 
          REFERENCES users(id),
        title VARCHAR(255)
      );
    `;

    console.log(`Created "ranking" table`);

    const createSettingsTable = await client.sql`
      CREATE TABLE IF NOT EXISTS rankSettings (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        rank_int INT,
        color VARCHAR(255),
        phrase VARCHAR(255)
      );
    `;

    console.log(`Created "rank settings" table`);

    const createSubTable = await client.sql`
      CREATE TABLE IF NOT EXISTS ranks (
        id SERIAL PRIMARY KEY,
        fk_rank_pg UUID DEFAULT uuid_generate_v4(), 
          constraint fk_page_unit
          foreign key (fk_rank_pg) 
          REFERENCES rankPages(id),
        fk_status UUID DEFAULT uuid_generate_v4(), 
          constraint fk_rank_setting
          foreign key (fk_status) 
          REFERENCES rankSettings(id),
        date DATE
      );
    `;

    console.log(`Created "rank" table`);

    // Insert data into the "ranking" table
    const insertedRankPage = await Promise.all(
      rankPages.map(async (rankPg) => {
        return client.sql`
        INSERT INTO rankPages (id, fk_user, title)
        VALUES (${rankPg.id}, ${rankPg.user_id}, ${rankPg.title})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedRankPage.length} rank pages`);

    
    // Insert data into the "rank settings" table
    const insertedRankSettings = await Promise.all(
      rankSettings.map(async (rankSet) => {
        return client.sql`
        INSERT INTO rankSettings (id, rank_int, color, phrase)
        VALUES (${rankSet.id}, ${rankSet.rank_int}, ${rankSet.color}, ${rankSet.phrase})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedRankSettings.length} rank settings`);

    // Insert data into the "ranks" table
    const insertedRanks = await Promise.all(
      rankingUnit.map(async (rankUnit) => {
        return client.sql`
        INSERT INTO ranks (id, fk_rank_pg, fk_status, date)
        VALUES (${rankUnit.id}, ${rankUnit.rank_tbl}, ${rankUnit.rank_set},  ${rankUnit.date})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedRanks.length} ranks`);

    return {
      createTable,
      createSettingsTable,
      createSubTable,
      savedRankPage: insertedRankPage,
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
