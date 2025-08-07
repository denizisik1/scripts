import os
import redis
from dotenv import load_dotenv

load_dotenv()

REDIS_DB = 6
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

    for key in keys:
        commands = redis_conn.lrange(key, 0, -1)
        updated = False
        new_commands = []

        for cmd in commands:
            original = cmd
            if cmd == "[EM,1234,9690,0,0,0,F,F,F];;":
                cmd = "[EM,1234,9690,0,0,10,F,F,F];;"
            elif cmd == "[EM,1234,9690,10,0,0,F,F,F];;":
                cmd = "[EM,1234,9690,10,0,10,F,F,F];;"
            new_commands.append(cmd)
            if cmd != original:
                updated = True

        if updated:
            redis_conn.delete(key)
            redis_conn.rpush(key, *new_commands)
            print(f"Updated {key}")

if __name__ == "__main__":
    fix_commands()
