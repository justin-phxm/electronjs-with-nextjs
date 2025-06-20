import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { DataTypes, Sequelize } from "sequelize";
import { DATABASE_PATH } from "../constants";

import { env } from "@/env";
import * as schema from "./schema";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DATABASE_PATH,
  logging: false,
});

export const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    comment: "Users table",
  }
);
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

const client = globalForDb.client ?? createClient({ url: env.DATABASE_URL });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
