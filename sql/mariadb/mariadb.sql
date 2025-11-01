-- Example of how you can add id column if missing.
ALTER TABLE `olci_diagnostic`
ADD COLUMN `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

-- Ouput total rows count:
SELECT COUNT(*) FROM olci_to_be_called;

-- Show list of tables of a given database:
SHOW TABLES;

-- Show list of tables of a given database:
SELECT table_name FROM information_schema.tables WHERE TABLE_SCHEMA='aractakip2';

-- Show triggers of a given table:
SHOW TRIGGERS;

-- Add created_at and updated_at:
-- I just noticed one column is TIMESTAMP and the other is DATETIME, what's up with that?
ALTER TABLE t1
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Detect duplicates:
SELECT qr_code_identifier, COUNT(*)
FROM your_table
GROUP BY qr_code_identifier
HAVING COUNT(*) > 1;

-- Create backup:
CREATE TABLE olci_araclar_backup LIKE olci_araclar;
INSERT INTO olci_araclar_backup SELECT * FROM olci_araclar;
RENAME TABLE olci_diagnostic TO _olci_diagnostic;
CREATE TABLE olci_diagnostic LIKE _olci_diagnostic;

-- Too many connections error:
-- You will have to modify a config file for this to persist across mysql restarts or system reboots.
show variables like "max_connections";
set global max_connections = 5000;
