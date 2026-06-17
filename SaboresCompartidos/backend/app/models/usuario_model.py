from pydantic import BaseModel

class RegistroUsuario(BaseModel):
    correo: str
    contrasena: str
    confirmar_contrasena: str

class LoginUsuario(BaseModel):
    correo: str
    contrasena: str