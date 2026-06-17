from pydantic import BaseModel

class ComentarioCreate(BaseModel):
    receta_id: str      # a qué receta pertenece
    usuario_id: str     # quién comenta
    texto: str

class Comentario(ComentarioCreate):
    id: str