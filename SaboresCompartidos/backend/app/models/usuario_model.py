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

class SolicitarCodigo(BaseModel):
    correo: str

class ValidarCodigo(BaseModel):
    correo: str
    codigo: str

class RestablecerContrasena(BaseModel):
    correo: str
    codigo: str
    nueva_contrasena: str

class ValidarContrasenaActual(BaseModel):
    contrasena: str

class CambiarContrasena(BaseModel):
    nueva_contrasena: str

class ValidarCodigoCorreo(BaseModel):
    codigo: str