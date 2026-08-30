import { sql } from "drizzle-orm";
import { getVercelDb, isDatabaseConfigured } from "../src/db/vercel-client.js";
import { internalServerError, json, methodNotAllowed } from "./_lib/http.js";

export default {
  async fetch(request: Request) {
    if (request.method !== "GET") return methodNotAllowed(["GET"]);

    if (!isDatabaseConfigured()) {
      return json({
        mode: "demo",
        ok: true,
        service: "maznet-billing",
        services: { database: "not_configured" },
      });
    }

    try {
      await getVercelDb().execute(sql`select 1`);
      return json({
        mode: "database",
        ok: true,
        service: "maznet-billing",
        services: { database: "connected" },
      });
    } catch (error) {
      const response = internalServerError(error);
      return json({
        mode: "database",
        ok: false,
        service: "maznet-billing",
        services: { database: "unavailable" },
      }, 503, response.headers);
    }
  },
};
