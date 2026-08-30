import { getVercelDb } from "../../src/db/vercel-client.js";
import { paymentWebhooks } from "../../src/db/vercel-schema.js";
import {
  callbackTokenIsValid,
  configurationRequired,
  internalServerError,
  json,
  methodNotAllowed,
} from "../_lib/http.js";

interface XenditWebhookBody {
  amount?: unknown;
  external_id?: unknown;
  id?: unknown;
  status?: unknown;
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") return methodNotAllowed(["POST"]);

    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;
    if (!expectedToken) return configurationRequired("XENDIT_WEBHOOK_TOKEN");
    if (!callbackTokenIsValid(request, expectedToken)) {
      return json({ error: "Invalid webhook signature" }, 401);
    }
    if (!process.env.DATABASE_URL) return configurationRequired("DATABASE_URL");

    let body: XenditWebhookBody;
    try {
      body = await request.json() as XenditWebhookBody;
    } catch {
      return json({ error: "Payload JSON tidak valid." }, 400);
    }

    const eventId = typeof body.id === "string" ? body.id.trim() : "";
    const externalId = typeof body.external_id === "string" ? body.external_id.trim() : "";
    const status = typeof body.status === "string" ? body.status.trim().toUpperCase() : "UNKNOWN";
    const amount = typeof body.amount === "number" && Number.isFinite(body.amount) ? body.amount : undefined;

    if (!eventId || eventId.length > 200 || !externalId || externalId.length > 200 || status.length > 50) {
      return json({ error: "Payload webhook tidak valid." }, 400);
    }

    try {
      const inserted = await getVercelDb()
        .insert(paymentWebhooks)
        .values({
          eventId,
          externalId,
          sanitizedPayload: JSON.stringify({ amount, external_id: externalId, id: eventId, status }),
          signatureValid: true,
          status,
        })
        .onConflictDoNothing({ target: paymentWebhooks.eventId })
        .returning({ eventId: paymentWebhooks.eventId });

      return json({ duplicate: inserted.length === 0, received: true });
    } catch (error) {
      return internalServerError(error);
    }
  },
};
