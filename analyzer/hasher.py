import hashlib
import json
from pathlib import Path

CACHE_PATH = Path(__file__).parent / "summaries_cache.json"


def _load_cache() -> dict:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text())
    return {}


def _save_cache(cache: dict) -> None:
    CACHE_PATH.write_text(json.dumps(cache, indent=2))


def file_hash(path: Path) -> str:
    if path.is_dir():
        key = f"dir:{path}"
        return hashlib.sha256(key.encode()).hexdigest()
    return hashlib.sha256(path.read_bytes()).hexdigest()


def get_cached_summary(path: Path) -> str | None:
    cache = _load_cache()
    h = file_hash(path)
    return cache.get(h)


def set_cached_summary(path: Path, summary: str) -> None:
    cache = _load_cache()
    cache[file_hash(path)] = summary
    _save_cache(cache)
