const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5434,
    user: 'postgres',
    password: 'postgres',
    database: 'sokonova',
  });

  try {
    await client.connect();
    console.log('Connected to database successfully!');
    
    const res = await client.query('SELECT version()');
    console.log('Database version:', res.rows[0].version);
    
    await client.end();
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

testConnection();