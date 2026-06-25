from pydantic import BaseModel
from typing import List, Optional

class Ingrediente(BaseModel):
    nombre: str
    cantidad: str

class RecetaCreate(BaseModel):
    titulo: str
    descripcion: str
    tiempo_aproximado: str
    dificultad: str
    porciones: int
    categoria: str
    momento_dia: str
    tipo_platillo: str
    ingredientes: List[Ingrediente]
    preparacion: List[str]
    usuario_id: str

class Receta(RecetaCreate):
    id: str
    imagen_url: Optional[str] = None
    autor_nombre: Optional[str] = None
    fecha_creacion: Optional[str] = None
    likes: int = 0
    comentarios_count: int = 0