import os
import redis
from dotenv import load_dotenv

load_dotenv()

REDIS_DB = 7
REDIS_KEY_PREFIX = "C:"

redis_conn = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    password=os.getenv("REDIS_PASSWORD"),
    db=REDIS_DB,
    decode_responses=True
)

def fix_commands():
    keys = redis_conn.keys(f"{REDIS_KEY_PREFIX}*")

    updated_keys = 0
    unchanged_keys = 0

    for key in keys:
        commands = redis_conn.lrange(key, 0, -1)
        updated = False
        new_commands = []

        for cmd in commands:
            if cmd == "[EM,1234,9690,10,0,10,F,F,F];;":
                print(f"{key}: '{cmd}' -> '[EM,1234,9690,10,F,F,F,F,F];;'")
                cmd = "[EM,1234,9690,10,F,F,F,F,F];;"
                updated = True
            elif cmd == "[EM,1234,9690,0,0,10,F,F,F];;":
                print(f"{key}: '{cmd}' -> '[EM,1234,9690,0,F,F,F,F,F];;'")
                cmd = "[EM,1234,9690,0,F,F,F,F,F];;"
                updated = True
            new_commands.append(cmd)

        if updated:
            redis_conn.delete(key)
            redis_conn.rpush(key, *new_commands)
            updated_keys += 1
        else:
            unchanged_keys += 1

    print(f"Updated: {updated_keys}, Unchanged: {unchanged_keys}")


if __name__ == "__main__":
    fix_commands()
