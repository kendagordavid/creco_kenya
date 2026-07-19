from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    data_dir: Path = Path("./data")
    top_k: int = 3

    backend_dir: Path = Path(__file__).resolve().parent.parent
    prototype_dir: Path = Path(__file__).resolve().parent.parent.parent
    wiki_dir: Path = Path(__file__).resolve().parent.parent.parent / "wiki"
    wiki_index_dir: Path = Path("./wiki_index")


settings = Settings()
