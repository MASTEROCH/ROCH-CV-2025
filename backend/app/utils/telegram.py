import hmac
import hashlib
import urllib.parse
from typing import Optional, Dict


def parse_init_data(init_data: str) -> Dict[str, str]:
    parts = urllib.parse.parse_qsl(init_data, keep_blank_values=True)
    return {k: v for k, v in parts}


def verify_telegram_auth(init_data: str, bot_token: str) -> bool:
    try:
        data = parse_init_data(init_data)
        hash_value = data.pop('hash', None)
        if not hash_value:
            return False
        check_string = '\n'.join(f"{k}={v}" for k, v in sorted(data.items()))
        secret_key = hashlib.sha256(bot_token.encode()).digest()
        computed_hash = hmac.new(secret_key, check_string.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(computed_hash, hash_value)
    except Exception:
        return False
