import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./vercel-schema.js";

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("DATABASE_URL belum dikonfigurasi.");
    this.name = "DatabaseConfigurationError";
  }
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getVercelDb() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new DatabaseConfigurationError();
  }

  return drizzle(neon(databaseUrl), { schema });
}
