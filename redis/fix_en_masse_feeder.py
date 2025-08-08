import os
import redis
import random
from dotenv import load_dotenv

load_dotenv()

REDIS_DB = 7 # Change it to a test DB.
REDIS_KEY_PREFIX = "C:"

redis_conn = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    password=os.getenv("REDIS_PASSWORD"),
    db=REDIS_DB,
    decode_responses=True
)

COMMANDS = [
    "[EM,1234,9690,10,0,10,F,F,F];;",
    "[EM,1234,9690,0,0,10,F,F,F];;"
]

def generate_random_imei():
    return ''.join(random.choices("0123456789", k=15))

def insert_test_commands():
    num_keys = random.randint(5000, 6000)

    for _ in range(num_keys):
        imei = generate_random_imei()
        key = f"{REDIS_KEY_PREFIX}{imei}"
        cmd = random.choice(COMMANDS)
        redis_conn.delete(key)
        redis_conn.rpush(key, cmd)

    print(f"Inserted {num_keys} test keys.")

if __name__ == "__main__":
    insert_test_commands()
