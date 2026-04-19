import os
from pathlib import Path
from openai import OpenAI
from analyzer.hasher import get_cached_summary, set_cached_summary

# Comma-separated list of Groq API keys for round-robin rotation on rate limit
_keys: list[str] = []
_key_index = 0


def _load_keys() -> list[str]:
    raw = os.environ.get("GROQ_API_KEYS", os.environ.get("GROQ_API_KEY", ""))
    return [k.strip() for k in raw.split(",") if k.strip()]


def _get_client() -> OpenAI:
    global _keys
    if not _keys:
        _keys = _load_keys()
    if not _keys:
        raise RuntimeError("No GROQ_API_KEY or GROQ_API_KEYS set in environment")
    return OpenAI(
        api_key=_keys[_key_index],
        base_url="https://api.groq.com/openai/v1",
    )


def summarize(project_name: str, path: Path, node_type: str) -> str:
    global _key_index, _keys

    cached = get_cached_summary(path)
    if cached:
        return cached

    snippet = ""
    if path.is_file():
        try:
            snippet = path.read_text(encoding="utf-8", errors="ignore")[:500]
        except Exception:
            snippet = ""

    prompt = (
        f"In one sentence (max 15 words), describe what this {node_type} does "
        f"in the context of the '{project_name}' project. "
        f"Path: {path.name}. Content preview: {snippet}. "
        f"Reply with ONLY the sentence, no explanation."
    )

    if not _keys:
        _keys = _load_keys()

    last_err = None
    for _ in range(len(_keys)):
        try:
            client = _get_client()
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=60,
            )
            content = response.choices[0].message.content
            summary = content.strip() if content else path.name
            set_cached_summary(path, summary)
            return summary
        except Exception as e:
            last_err = e
            if "429" in str(e) or "rate_limit" in str(e):
                _key_index = (_key_index + 1) % len(_keys)
                continue
            raise

    raise RuntimeError(f"All Groq keys exhausted: {last_err}")
