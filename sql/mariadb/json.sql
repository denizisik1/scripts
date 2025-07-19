-- Example of a json search:
SELECT parsed_data
FROM teltonika_parsed_data_log
WHERE imei = '353691846940202'
    AND JSON_UNQUOTE(JSON_EXTRACT(parsed_data, '$.state_data."102"')) IS NOT NULL
ORDER BY logged_at DESC
LIMIT 1;

-- Another example of a json search:
SELECT *
FROM olci_teltonika_parsed_data_log
WHERE JSON_CONTAINS_PATH(parsed_data, 'one', '$."83"')
  AND JSON_UNQUOTE(JSON_EXTRACT(parsed_data, '$."83"')) NOT IN ('0', '0x00')
  AND imei = 353691840871544
ORDER BY id DESC
LIMIT 1;
