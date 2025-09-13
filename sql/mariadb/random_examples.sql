SELECT *
FROM olci_device_log_packet_arac
WHERE `imei` = '860141070824686'
  AND SUBSTRING(log, 22, 2) > '25'
  AND `log` like '[M%' OR `log` like '[B%'
ORDER BY `id` DESC
LIMIT 10;
