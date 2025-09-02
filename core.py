import os
import hashlib

def getchecksum():
    # 16 zufällige Bytes
    random_bytes = os.urandom(16)

    # SHA256 drüber berechnen
    sha_sum = hashlib.sha256(random_bytes).hexdigest()

    return sha_sum
