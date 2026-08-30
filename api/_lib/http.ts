import { timingSafeEqual } from "node:crypto";

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...headers },
  });
}

export function methodNotAllowed(methods: string[]) {
  return json({ error: "Method not allowed" }, 405, { Allow: methods.join(", ") });
}

export function configurationRequired(variable: string) {
  return json({ error: `Konfigurasi ${variable} diperlukan.` }, 503);
}

export function internalServerError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("Vercel Function error:", message);
  return json({ error: "Terjadi kesalahan pada server." }, 500);
}

function secretsMatch(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);

  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export function bearerAuthorization(request: Request, expectedSecret: string | undefined) {
  if (!expectedSecret) return "unconfigured" as const;

  const authorization = request.headers.get("authorization") ?? "";
  const actualSecret = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  return secretsMatch(actualSecret, expectedSecret) ? "authorized" as const : "unauthorized" as const;
}

export function callbackTokenIsValid(request: Request, expectedToken: string) {
  return secretsMatch(request.headers.get("x-callback-token") ?? "", expectedToken);
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
