from pydantic import BaseModel


class LikeToggle(BaseModel):
    usuario_id: str