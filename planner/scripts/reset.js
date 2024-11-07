
const { db } = require('@vercel/postgres');

async function main() {
    const client = await db.connect();
    await client.sql`DROP TABLE IF EXISTS users CASCADE;`
    await client.sql`DROP TABLE IF EXISTS notes CASCADE;`
    await client.sql`DROP TABLE IF EXISTS goals CASCADE;`
    await client.sql`DROP TABLE IF EXISTS goalCompletions CASCADE;`
    await client.sql`DROP TABLE IF EXISTS ranking CASCADE;`
    await client.sql`DROP TABLE IF EXISTS rankSettings CASCADE;`
    await client.sql`DROP TABLE IF EXISTS ranks CASCADE;`

    console.log(`Deleted all db tables`);

    await client.end();
}

main().catch((err) => {
    console.error(
      'An error occurred while attempting to delete the database:',
      err,
    );
  });