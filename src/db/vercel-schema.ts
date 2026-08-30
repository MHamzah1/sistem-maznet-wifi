import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
};

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  role: text("role").notNull(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

export const packages = pgTable("packages", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  speedMbps: integer("speed_mbps").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
});

export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  customerCode: text("customer_code").notNull(),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  packageId: text("package_id").notNull().references(() => packages.id),
  priceSnapshot: integer("price_snapshot").notNull(),
  installedAt: text("installed_at").notNull(),
  dueDay: integer("due_day").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  deviceInfo: text("device_info"),
  ...timestamps,
}, (table) => [
  uniqueIndex("customers_code_uidx").on(table.customerCode),
  uniqueIndex("customers_phone_uidx").on(table.phone),
  index("customers_status_idx").on(table.status),
]);

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  packageName: text("package_name").notNull(),
  period: text("period").notNull(),
  issuedAt: text("issued_at").notNull(),
  dueDate: text("due_date").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  paymentLink: text("payment_link"),
  ...timestamps,
}, (table) => [
  uniqueIndex("invoice_customer_period_uidx").on(table.customerId, table.period),
  index("invoice_status_due_idx").on(table.status, table.dueDate),
]);

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  paymentNumber: text("payment_number").notNull().unique(),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  customerId: text("customer_id").notNull().references(() => customers.id),
  amount: integer("amount").notNull(),
  channel: text("channel").notNull(),
  method: text("method").notNull(),
  externalId: text("external_id").unique(),
  paidAt: timestamp("paid_at", { mode: "string", withTimezone: true }).notNull(),
  staffId: text("staff_id").references(() => users.id),
  notes: text("notes"),
  proofData: text("proof_data"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("payments_paid_idx").on(table.paidAt)]);

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

export const whatsappTemplates = pgTable("whatsapp_templates", {
  id: text("id").primaryKey(),
  event: text("event").notNull().unique(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  active: boolean("active").default(true).notNull(),
});

export const whatsappNotifications = pgTable("whatsapp_notifications", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  invoiceId: text("invoice_id").references(() => invoices.id),
  destination: text("destination").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(),
  sentAt: timestamp("sent_at", { mode: "string", withTimezone: true }),
  error: text("error"),
});

export const paymentWebhooks = pgTable("payment_webhooks", {
  eventId: text("event_id").primaryKey(),
  externalId: text("external_id"),
  signatureValid: boolean("signature_valid").notNull(),
  status: text("status").notNull(),
  sanitizedPayload: text("sanitized_payload"),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  summary: text("summary").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("audit_created_idx").on(table.createdAt)]);
