-- Example of a searching database tables containing some column name.
SELECT
    TABLE_SCHEMA,
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM
    information_schema.COLUMNS
WHERE
    COLUMN_NAME LIKE '%musteriID%'
    AND TABLE_SCHEMA = 'aractakip2'
ORDER BY
    TABLE_NAME ASC;

-- Making the example below more useful, like calling it with: call col('client_name');
CREATE PROCEDURE col(IN search_column_name VARCHAR(255))
BEGIN
    SELECT
        TABLE_SCHEMA,
        TABLE_NAME,
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE
    FROM
        information_schema.COLUMNS
    WHERE
        COLUMN_NAME LIKE CONCAT('%', search_column_name, '%')
        AND TABLE_SCHEMA = 'aractakip2'
    ORDER BY
        TABLE_NAME ASC;
END;
