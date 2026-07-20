from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    data_dir: Path = Path("./data")
    top_k: int = 3

    backend_dir: Path = Path(__file__).resolve().parent.parent
    prototype_dir: Path = Path(__file__).resolve().parent.parent.parent
    wiki_dir: Path = Path(__file__).resolve().parent.parent.parent / "wiki"
    wiki_index_dir: Path = Path("./wiki_index")


settings = Settings()


def openai_configured() -> bool:
    """True only when a real API key is set (not empty or placeholder)."""
    key = settings.openai_api_key.strip()
    if not key:
        return False
    lowered = key.lower()
    if lowered.startswith("sk-your") or "your-key" in lowered or lowered in ("changeme", "xxx"):
        return False
    return key.startswith("sk-") and len(key) > 20

