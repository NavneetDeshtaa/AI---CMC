import os
import uuid

STORAGE_DIR = "storage"

os.makedirs(STORAGE_DIR, exist_ok=True)


def save_file(file_bytes: bytes, original_filename: str) -> str:
    ext = os.path.splitext(original_filename)[1]
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(STORAGE_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(file_bytes)
    return file_path