from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext (schems=["bcrypt"], deprecated="auto")

SECRET_KEY="tu_clave_secreta_super_segura_para_el_proyecto"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120  # La sesión dura 2 horas

def verificar_contrasena(contrasena_plana: str, constrasena_encriptada: str) -> bool:
    return pwd_context.verify(contrasena_plana, constrasena_encriptada)

def encriptar_contrasena(contrasena: str) -> str:
    return pwd_context.hash(contrasena)

def crear_token_acceso(data: dict) -> str:
    to_encode = data.copy()
    expire = datatime.utcnow() + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire}) 
    return jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)

    