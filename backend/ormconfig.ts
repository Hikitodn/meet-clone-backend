import dotenv from "dotenv";
dotenv.config();

const { HOST_DB, USERNAMES_DB, PASSWORD_DB, DB_NAME, PORT_DB } = process.env;

export default {
  type: "postgres",
  host: HOST_DB,
  port: PORT_DB,
  username: USERNAMES_DB,
  password: PASSWORD_DB,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
};
