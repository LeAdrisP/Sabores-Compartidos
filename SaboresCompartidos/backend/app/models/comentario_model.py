from pydantic import BaseModel

class ComentarioCreate(BaseModel):
    receta_id: str  
    usuario_id: str    
    texto: str

class Comentario(ComentarioCreate):
    id: str