from fastapi import APIRouter, HTTPException
from data.usuarios_data import obtener_usuario_por_id
from data.usuarios_data import obtener_usuario_por_id, actualizar_usuario
from models.usuario_model import ActualizarUsuario

router = APIRouter(
    prefix="/api/usuarios",
    tags=["Usuarios"]
)

@router.get("/{usuario_id}")
def obtener_perfil(usuario_id: str):
    resultado = obtener_usuario_por_id(usuario_id)
    if resultado is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return resultado

@router.put("/{usuario_id}")
def actualizar_perfil(usuario_id: str, datos: ActualizarUsuario):
    exito = actualizar_usuario(usuario_id, datos.model_dump(exclude_none=True))
    if not exito:
        raise HTTPException(status_code=500, detail="Error al actualizar perfil")
    return { "status": "success", "mensaje": "Perfil actualizado" }