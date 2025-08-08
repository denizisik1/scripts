-- Use BTREE for all things, hash etc. require some additional setup I think, refer to documentation.

-- Keep in mind: SQL Databases will only use the index (therefore speed up the query) if your where clause includes the leading(first) column of the index.

-- This is how you add combination index, remember the programs searching should also do in order...
CREATE INDEX idx_loggedat_imei_tripstatus
ON olci_teltonika_parsed_data_log (logged_at DESC, imei, trip_status)
USING BTREE;

-- If it is just one, the example would look like:
CREATE INDEX idx_loggedat
ON olci_teltonika_parsed_data_log (logged_at DESC)
USING BTREE;
