"""
This is just a proof of concept, not tested for production use.
Also my angle on doing it programmatically as opposed to using database
features might change in the future.
"""

import asyncio
import asyncpg


"""
Manual Foreign Key Management (Async Version with Pooling)

This demonstrates how to simulate foreign key behavior asynchronously
using asyncpg and a connection pool:

1. Foreign key existence check before insert
2. Manual ON DELETE RESTRICT
3. Manual ON DELETE CASCADE
"""

DB_DSN = "postgresql://youruser:yourpass@localhost/yourdb"


async def insert_book(pool, book_title, author_id):
    """
    Simulates a foreign key existence check.
    Only inserts a book if its author exists.
    """
    async with pool.acquire() as conn:
        exists = await conn.fetchval(
            "SELECT 1 FROM authors WHERE id = $1", author_id
        )
        if exists:
            await conn.execute(
                "INSERT INTO books (title, author_id) VALUES ($1, $2)",
                book_title,
                author_id,
            )
            print("Book inserted.")
        else:
            print("Cannot insert: author_id does not exist.")


async def delete_author_restrict(pool, author_id):
    """
    Simulates ON DELETE RESTRICT.
    Prevents deletion if dependent rows exist.
    """
    async with pool.acquire() as conn:
        count = await conn.fetchval(
            "SELECT COUNT(*) FROM books WHERE author_id = $1", author_id
        )
        if count > 0:
            print("Delete restricted: author has books.")
        else:
            await conn.execute("DELETE FROM authors WHERE id = $1", author_id)
            print("Author deleted.")


async def delete_author_cascade(pool, author_id):
    """
    Simulates ON DELETE CASCADE.
    Deletes dependent rows first, then parent.
    """
    async with pool.acquire() as conn:
        count = await conn.fetchval(
            "SELECT COUNT(*) FROM books WHERE author_id = $1", author_id
        )
        if count > 0:
            await conn.execute(
                "DELETE FROM books WHERE author_id = $1", author_id
            )
            print(f"{count} books deleted.")

        await conn.execute("DELETE FROM authors WHERE id = $1", author_id)
        print("Author deleted (cascade).")


async def main():
    """
    Example usage.

    Run this script with:
        python -m asyncio manual_fk_behavior_async_pool.py

    Uncomment whichever operation you want to test.
    """
    pool = await asyncpg.create_pool(dsn=DB_DSN, min_size=1, max_size=5)

    # await insert_book(pool, "Book A", 1)
    # await delete_author_restrict(pool, 1)
    # await delete_author_cascade(pool, 1)

    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
