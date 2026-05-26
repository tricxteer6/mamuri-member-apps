const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const runSchema = async (connection, schemaPath) => {
  const sql = await fs.readFile(schemaPath, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/^USE\s+/i.test(s));

  for (const statement of statements) {
    await connection.query(statement);
  }
};

const seedAdmin = async (connection) => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin Mamuri";

  if (!email || !password) return;

  const [rows] = await connection.query("SELECT id FROM users WHERE email = ?", [email]);
  if (rows.length) return;

  const hash = await bcrypt.hash(password, 10);
  await connection.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
    [name, email, hash]
  );
  // eslint-disable-next-line no-console
  console.log("Default admin created:", email);
};

const bootstrapDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  }).catch(async () => {
    const fallback = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });
    await fallback.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await fallback.query(`USE \`${process.env.DB_NAME}\``);
    return fallback;
  });

  const schemaPath = path.join(__dirname, "../../sql/schema.sql");
  await runSchema(connection, schemaPath);
  await seedAdmin(connection);
  await connection.end();
};

module.exports = { bootstrapDatabase };
