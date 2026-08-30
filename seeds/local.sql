PRAGMA foreign_keys = ON;
INSERT OR IGNORE INTO users(id,name,email,phone,role,password_hash,active) VALUES
('usr-owner','Rizky Ahmad','owner@maznet.id',NULL,'Owner','demo-managed-by-runtime',1),
('usr-admin','Dewi Lestari','admin@maznet.id',NULL,'Admin','demo-managed-by-runtime',1),
('usr-tech','Agus Setiawan','teknisi@maznet.id',NULL,'Teknisi','demo-managed-by-runtime',1),
('usr-cust-128','Ahmad Fauzi',NULL,'6281234567821','Customer','demo-managed-by-runtime',1);
INSERT OR IGNORE INTO packages(id,code,name,speed_mbps,price,description,active) VALUES
('pkg-basic','BASIC-10','Maznet Basic',10,150000,'Koneksi stabil untuk kebutuhan harian',1),
('pkg-family','FAMILY-20','Maznet Family',20,220000,'Nyaman untuk seluruh keluarga',1),
('pkg-plus','PLUS-30','Maznet Plus',30,300000,'Streaming dan kerja tanpa hambatan',1),
('pkg-pro','PRO-50','Maznet Pro',50,450000,'Performa maksimal untuk bisnis',1);
INSERT OR IGNORE INTO customers(id,customer_code,user_id,name,phone,address,latitude,longitude,package_id,price_snapshot,installed_at,due_day,status,notes) VALUES
('cust-128','MZN-000128','usr-cust-128','Ahmad Fauzi','6281234567821','Jl. Melati No. 18, Sukamaju',-6.9147,107.6098,'pkg-family',220000,'2024-03-10',10,'Menunggak','Follow-up reminder'),
('cust-246','MZN-000246',NULL,'Siti Nurhaliza','6285788211090','Kp. Cibiru RT 03/RW 06',-6.9021,107.6432,'pkg-basic',150000,'2024-08-08',8,'Menunggak',NULL),
('cust-314','MZN-000314',NULL,'Budi Santoso','6281399124432','Perum Griya Asri Blok C7',-6.9251,107.6012,'pkg-plus',300000,'2025-01-15',15,'Aktif',NULL),
('cust-087','MZN-000087',NULL,'Rina Marlina','6282277104567','Jl. Mawar Dalam No. 4',-6.8812,107.6211,'pkg-family',220000,'2023-11-05',5,'Terisolir','Status administratif manual'),
('cust-421','MZN-000421',NULL,'Dedi Kurniawan','6281955127890','Desa Mekarsari RT 02/RW 01',-6.9311,107.5881,'pkg-pro',450000,'2025-05-20',20,'Aktif',NULL),
('cust-399','MZN-000399',NULL,'Nia Ramadhani','6287833092211','Jl. Anggrek Raya No. 9',-6.8999,107.6111,'pkg-basic',150000,'2025-04-12',12,'Aktif',NULL);
INSERT OR IGNORE INTO invoices(id,invoice_number,customer_id,package_name,period,issued_at,due_date,amount,status) VALUES
('inv-128-jun','INV-MZN-202606-000128','cust-128','Maznet Family','2026-06','2026-06-03','2026-06-10',220000,'OVERDUE'),
('inv-246-jun','INV-MZN-202606-000246','cust-246','Maznet Basic','2026-06','2026-06-01','2026-06-08',150000,'OVERDUE'),
('inv-314-jun','INV-MZN-202606-000314','cust-314','Maznet Plus','2026-06','2026-06-08','2026-06-15',300000,'PENDING'),
('inv-421-jun','INV-MZN-202606-000421','cust-421','Maznet Pro','2026-06','2026-06-13','2026-06-20',450000,'PENDING'),
('inv-399-may','INV-MZN-202605-000399','cust-399','Maznet Basic','2026-05','2026-05-05','2026-05-12',150000,'PAID');
INSERT OR IGNORE INTO payments(id,payment_number,invoice_id,customer_id,amount,channel,method,external_id,paid_at,status) VALUES
('pay-482','PAY-202606-00482','inv-399-may','cust-399',150000,'XENDIT','QRIS','xnd-482','2026-06-12 09:42:00','SUCCESS');
INSERT OR IGNORE INTO settings(key,value) VALUES ('grace_period_days','3'),('invoice_lead_days','7'),('business_name','Maznet Berkah'),('xendit_enabled','false'),('whatsapp_enabled','false');
INSERT OR IGNORE INTO whatsapp_templates(id,event,name,content,active) VALUES
('wa-created','INVOICE_CREATED','Invoice Dibuat','Halo {{nama}}, tagihan {{invoice}} sebesar {{nominal}} telah dibuat.',1),
('wa-due','DUE_DATE','Hari Jatuh Tempo','Tagihan {{invoice}} jatuh tempo hari ini.',1),
('wa-overdue','OVERDUE','Belum Dibayar','Tagihan {{invoice}} telah melewati jatuh tempo.',1),
('wa-paid','PAYMENT_SUCCESS','Pembayaran Berhasil','Terima kasih, pembayaran {{nominal}} telah diterima.',1);
INSERT OR IGNORE INTO whatsapp_notifications(id,customer_id,invoice_id,destination,content,status,sent_at,error) VALUES
('notif-001','cust-128','inv-128-jun','6281234567821','Reminder tagihan Juni','configuration_required',NULL,'Provider belum dikonfigurasi');
INSERT OR IGNORE INTO audit_logs(id,actor_id,action,entity_type,entity_id,summary,created_at) VALUES
('audit-001','usr-admin','PAYMENT_MANUAL','payment','pay-482','Pembayaran dicatat dan invoice diperbarui','2026-06-12 09:42:00'),
('audit-002','usr-owner','SETTINGS_UPDATE','settings','grace_period_days','Grace period ditetapkan 3 hari','2026-06-11 08:10:00');
