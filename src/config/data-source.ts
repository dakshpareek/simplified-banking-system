import "reflect-metadata";
import { DataSource } from "typeorm";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export const AppDataSource = new DataSource({
  type: "postgres",

  url: databaseUrl,

  synchronize: true,

  logging: false,

  entities: ["src/entities/*.ts"],
});
