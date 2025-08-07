-- Simple version.
SELECT DISTINCT type FROM your_table;

-- Or for a better view:
SELECT type, COUNT(*) AS count
FROM your_table
GROUP BY type
ORDER BY count DESC;
