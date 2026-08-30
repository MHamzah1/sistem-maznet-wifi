import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations/vercel",
  schema: "./src/db/vercel-schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
