import { and, eq, ne } from "drizzle-orm";
import { getVercelDb } from "../../src/db/vercel-client.js";
import { auditLogs, customers, invoices, packages, settings } from "../../src/db/vercel-schema.js";

type BillingSource = "BILLING_MANUAL" | "BILLING_SCHEDULED";

function jakartaDateParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Jakarta",
    year: "numeric",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    day: Number(values.day),
    month: Number(values.month),
    year: Number(values.year),
  };
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function runDailyBilling(source: BillingSource) {
  const db = getVercelDb();
  const today = jakartaDateParts(new Date());
  const period = `${today.year}-${String(today.month).padStart(2, "0")}`;
  const compactPeriod = period.replace("-", "");

  const [leadSetting] = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, "invoice_lead_days"))
    .limit(1);
  const configuredLeadDays = Number(leadSetting?.value ?? 7);
  const leadDays = Number.isInteger(configuredLeadDays) && configuredLeadDays >= 0
    ? Math.min(configuredLeadDays, 31)
    : 7;

  const billableCustomers = await db
    .select({
      customerCode: customers.customerCode,
      customerId: customers.id,
      dueDay: customers.dueDay,
      packageName: packages.name,
      price: customers.priceSnapshot,
    })
    .from(customers)
    .innerJoin(packages, eq(customers.packageId, packages.id))
    .where(and(
      eq(packages.active, true),
      ne(customers.status, "Nonaktif"),
      ne(customers.status, "Terisolir"),
    ));

  const lastDayOfMonth = new Date(Date.UTC(today.year, today.month, 0)).getUTCDate();
  const todayUtc = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const pendingInvoices = billableCustomers.flatMap((customer) => {
    const dueDay = Math.min(Math.max(customer.dueDay, 1), lastDayOfMonth);
    const dueDate = new Date(Date.UTC(today.year, today.month - 1, dueDay));
    const issueDate = new Date(dueDate);
    issueDate.setUTCDate(issueDate.getUTCDate() - leadDays);

    if (todayUtc < issueDate) return [];

    return [{
      amount: customer.price,
      customerId: customer.customerId,
      dueDate: isoDate(dueDate),
      id: `inv:${period}:${customer.customerId}`,
      invoiceNumber: `INV-MZN-${compactPeriod}-${customer.customerCode.replace(/^MZN-/, "")}`,
      issuedAt: isoDate(todayUtc),
      packageName: customer.packageName,
      period,
      status: "PENDING",
    }];
  });

  const inserted = pendingInvoices.length > 0
    ? await db
        .insert(invoices)
        .values(pendingInvoices)
        .onConflictDoNothing({ target: [invoices.customerId, invoices.period] })
        .returning({ id: invoices.id })
    : [];

  await db.insert(auditLogs).values({
    action: source,
    entityType: "billing",
    id: crypto.randomUUID(),
    summary: `Billing ${period} selesai; ${inserted.length} invoice baru dibuat.`,
  });

  return {
    created: inserted.length,
    duplicatesPrevented: true,
    period,
    scanned: billableCustomers.length,
    timezone: "Asia/Jakarta",
  };
}
