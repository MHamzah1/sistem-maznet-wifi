import { isDatabaseConfigured } from "../src/db/vercel-client.js";
import { json, methodNotAllowed } from "./_lib/http.js";

export default {
  fetch(request: Request) {
    if (request.method !== "GET") return methodNotAllowed(["GET"]);

    return json({
      data: {
        database: isDatabaseConfigured(),
        whatsapp: false,
        xendit: Boolean(process.env.XENDIT_SECRET_KEY && process.env.XENDIT_WEBHOOK_TOKEN),
      },
    });
  },
};
