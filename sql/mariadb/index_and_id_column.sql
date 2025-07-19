-- This is how you add combination index, remember the programs searching should also do in order...
# For example search CLIENTID and RECDATE not RECDATE and CLIENTID.
ALTER TABLE `olci_diagnostic`
ADD INDEX `idx_clientid_recdate` (`CLIENTID`, `RECDATE`) USING BTREE;

-- Another Example.
CREATE INDEX imei_and_created_at_idx
ON olci_device_log_packet_arac (imei, created_at DESC)
USING BTREE;

-- Explicit Index Type Decleration
ALTER TABLE olci_cimtas_logs ADD INDEX imei_hash_idx (imei) USING HASH;
