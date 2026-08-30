import { desc } from "drizzle-orm";
import { getVercelDb } from "../src/db/vercel-client.js";
import { items } from "../src/db/vercel-schema.js";
import { configurationRequired, internalServerError, json, methodNotAllowed } from "./_lib/http.js";

interface CreateItemBody {
  title?: unknown;
}

export default {
  async fetch(request: Request) {
    if (!process.env.DATABASE_URL) return configurationRequired("DATABASE_URL");

    try {
      const db = getVercelDb();

      if (request.method === "GET") {
        const result = await db.select().from(items).orderBy(desc(items.createdAt)).limit(100);
        return json(result);
      }

      if (request.method === "POST") {
        let body: CreateItemBody;
        try {
          body = await request.json() as CreateItemBody;
        } catch {
          return json({ error: "Payload JSON tidak valid." }, 400);
        }

        const title = typeof body.title === "string" ? body.title.trim() : "";
        if (!title || title.length > 200) {
          return json({ error: "Title wajib diisi dan maksimal 200 karakter." }, 400);
        }

        const [created] = await db.insert(items).values({ title }).returning();
        return json(created, 201);
      }

      return methodNotAllowed(["GET", "POST"]);
    } catch (error) {
      return internalServerError(error);
    }
  },
};
