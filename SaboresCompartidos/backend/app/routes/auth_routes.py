from fastapi import APIRouter, HTTPException, status
from models.usuario_model import RegistroUsuario, LoginUsuario
from data.usuarios_data import registrar_nuevo_usuario, buscar_usuario_por_correo

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)

@router.post("/registro", status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario: RegistroUsuario):
    resultado = registrar_nuevo_usuario(
        correo=usuario.correo, 
        contrasena=usuario.contrasena, 
        confirmar_contrasena=usuario.confirmar_contrasena
    )
    
    if resultado and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
        
    if resultado is None:
        raise HTTPException(status_code=500, detail="Error interno al guardar en Firebase")
        
    return {
        "status": "success",
        "mensaje": "Usuario creado exitosamente",
        "usuario_id": resultado["id"]
    }

@router.post("/login")
def login_usuario(usuario: LoginUsuario):
    resultado = buscar_usuario_por_correo(usuario.correo)
    
    if resultado is None or resultado.get("contrasena") != usuario.contrasena:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrecta")
    
    return {
        "status": "success",
        "mensaje": "Login exitoso",
        "usuario_id": resultado["id"]
    }