CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`summary` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_code` text NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`package_id` text NOT NULL,
	`price_snapshot` integer NOT NULL,
	`installed_at` text NOT NULL,
	`due_day` integer NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`device_info` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_code_uidx` ON `customers` (`customer_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_phone_uidx` ON `customers` (`phone`);--> statement-breakpoint
CREATE INDEX `customers_status_idx` ON `customers` (`status`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`customer_id` text NOT NULL,
	`package_name` text NOT NULL,
	`period` text NOT NULL,
	`issued_at` text NOT NULL,
	`due_date` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text NOT NULL,
	`payment_link` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `invoice_customer_period_uidx` ON `invoices` (`customer_id`,`period`);--> statement-breakpoint
CREATE INDEX `invoice_status_due_idx` ON `invoices` (`status`,`due_date`);--> statement-breakpoint
CREATE TABLE `packages` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`speed_mbps` integer NOT NULL,
	`price` integer NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packages_code_unique` ON `packages` (`code`);--> statement-breakpoint
CREATE TABLE `payment_webhooks` (
	`event_id` text PRIMARY KEY NOT NULL,
	`external_id` text,
	`signature_valid` integer NOT NULL,
	`status` text NOT NULL,
	`sanitized_payload` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_number` text NOT NULL,
	`invoice_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`amount` integer NOT NULL,
	`channel` text NOT NULL,
	`method` text NOT NULL,
	`external_id` text,
	`paid_at` text NOT NULL,
	`staff_id` text,
	`notes` text,
	`proof_data` text,
	`status` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_payment_number_unique` ON `payments` (`payment_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `payments_external_id_unique` ON `payments` (`external_id`);--> statement-breakpoint
CREATE INDEX `payments_paid_idx` ON `payments` (`paid_at`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`role` text NOT NULL,
	`password_hash` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);--> statement-breakpoint
CREATE TABLE `whatsapp_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`invoice_id` text,
	`destination` text NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL,
	`sent_at` text,
	`error` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `whatsapp_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`event` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `whatsapp_templates_event_unique` ON `whatsapp_templates` (`event`);--> statement-breakpoint
SELECT 1;