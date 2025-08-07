-- Use BTREE for all things, hash etc. require some additional setup I think, refer to documentation.

-- This is how you add combination index, remember the programs searching should also do in order...
# For example search CLIENTID and RECDATE not RECDATE and CLIENTID.
ALTER TABLE `olci_diagnostic`
ADD INDEX `idx_clientid_recdate` (`CLIENTID`, `RECDATE`) USING BTREE;

-- Another Example.
CREATE INDEX idx_imei_and_created_at
ON olci_device_log_packet_arac (imei, created_at DESC)
USING BTREE;

-- Explicit Index Type Decleration
ALTER TABLE olci_cimtas_logs ADD INDEX idx_imei (imei) USING BTREE;

-- SQL Databases will only use the index (therefore speed up the query) if your where clause includes the leading(first) column of the index.
