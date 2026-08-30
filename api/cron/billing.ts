import { runDailyBilling } from "../_lib/billing.js";
import {
  bearerAuthorization,
  configurationRequired,
  internalServerError,
  json,
  methodNotAllowed,
} from "../_lib/http.js";

export default {
  async fetch(request: Request) {
    if (request.method !== "GET") return methodNotAllowed(["GET"]);

    const authorization = bearerAuthorization(request, process.env.CRON_SECRET);
    if (authorization === "unconfigured") return configurationRequired("CRON_SECRET");
    if (authorization === "unauthorized") return json({ error: "Unauthorized" }, 401);
    if (!process.env.DATABASE_URL) return configurationRequired("DATABASE_URL");

    try {
      return json({ data: await runDailyBilling("BILLING_SCHEDULED") });
    } catch (error) {
      return internalServerError(error);
    }
  },
};
