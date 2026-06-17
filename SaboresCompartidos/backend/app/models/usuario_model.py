from pydantic import BaseModel
from typing import Optional

class RegistroUsuario(BaseModel):
    correo: str
    contrasena: str
    confirmar_contrasena: str

class LoginUsuario(BaseModel):
    correo: str
    contrasena: str

class ActualizarUsuario(BaseModel):
    nombre: Optional[str] = None
    nombre_usuario: Optional[str] = None
    biografia: Optional[str] = None
    ubicacion: Optional[str] = None