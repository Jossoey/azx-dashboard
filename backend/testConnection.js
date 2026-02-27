const { Client } = require('pg');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });

async function main() {
  let password = 'MJFR7sfXAQIdA9Vj3KX6';
  

  const client = new Client({
    host: 'azx-db.cf2s6gaqewn7.ap-southeast-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password,
    ssl: { rejectUnauthorized: false, ca: require('fs').readFileSync('/certs/global-bundle.pem').toString() }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log(res.rows[0].version);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await client.end();
  }
}
main().catch(console.error);