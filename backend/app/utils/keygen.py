import hashlib
import base64

def create_unique_random_key(url: str) -> str:
    """
    Generates a deterministic short ID based on the URL input.
    Algorithm: MD5 Hash -> Base64 Encode -> Truncate to 8 chars
    """
    # hash the URL with md5
    hash_object = hashlib.md5(url.encode())
    
    # get the digest (the raw bytes of the hash)
    hash_digest = hash_object.digest()
    
    # encode to Base64 (makes it readable: A-Z, a-z, 0-9, -)
    # urlsafe_b64encode replaces '+' and '/' with '-' and '_'
    b64_encoded = base64.urlsafe_b64encode(hash_digest)
    
    # decode to string and take the first 8 characters
    # Example: '    '
    return b64_encoded.decode()[:8]