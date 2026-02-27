const { Client } = require("pg");
const bcrypt = require("bcrypt");

const client = new Client({
  host: "azx-db.cf2s6gaqewn7.ap-southeast-1.rds.amazonaws.com",
  user: "postgres",
  password: "MJFR7sfXAQIdA9Vj3KX6",
  database: "azx-db",
  port: 5432
});

(async () => {
  try {
    await client.connect();

    const email = "useradmin@gmail.com";
    const passwordPlain = "admin1234";

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
    `;
    await client.query(query, [email, hashedPassword]);

    console.log("Test user inserted!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
})();