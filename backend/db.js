import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "mateus",
  password: "shopper",
  database: "shopper",
});
