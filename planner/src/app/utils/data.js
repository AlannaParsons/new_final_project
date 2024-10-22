import { sql } from '@vercel/postgres';
import {
  User
} from './dataStructure';
// write dynamic 

export async function fetchUsers() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

     console.log('Fetching user data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<User>`SELECT * FROM users`;

     console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}
