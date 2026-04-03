from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Tikzy Backend"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str = "sqlite:///./tikzy.db"

    SECRET_KEY: str = "tikzy_super_secret_key_change_this_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()