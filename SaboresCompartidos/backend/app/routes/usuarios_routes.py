from fastapi import APIRouter, HTTPException
from data.usuarios_data import obtener_usuario_por_id
from data.usuarios_data import obtener_usuario_por_id, actualizar_usuario
from models.usuario_model import ActualizarUsuario
from data.usuarios_data import validar_contrasena_actual, cambiar_contrasena
from models.usuario_model import ValidarContrasenaActual, CambiarContrasena
from core.email_service import enviar_codigo_verificacion
from data.usuarios_data import (
    generar_codigo_verificacion_correo,
    validar_codigo_verificacion_correo,
    obtener_usuario_por_id
)
from models.usuario_model import ValidarCodigoCorreo

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

@router.post("/{usuario_id}/validar-contrasena")
def validar_contrasena(usuario_id: str, datos: ValidarContrasenaActual):
    es_valida = validar_contrasena_actual(usuario_id, datos.contrasena)
    if not es_valida:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return {"status": "success", "mensaje": "Contraseña verificada"}


@router.put("/{usuario_id}/cambiar-contrasena")
def actualizar_contrasena_perfil(usuario_id: str, datos: CambiarContrasena):
    exito = cambiar_contrasena(usuario_id, datos.nueva_contrasena)
    if not exito:
        raise HTTPException(status_code=500, detail="Error al cambiar la contraseña")
    return {"status": "success", "mensaje": "Contraseña actualizada"}

@router.post("/{usuario_id}/enviar-codigo-correo")
def enviar_codigo_correo(usuario_id: str):
    usuario = obtener_usuario_por_id(usuario_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    codigo = generar_codigo_verificacion_correo(usuario_id)
    if codigo is None:
        raise HTTPException(status_code=500, detail="Error al generar el código")

    enviado = enviar_codigo_verificacion(usuario["correo"], codigo)
    if not enviado:
        raise HTTPException(status_code=500, detail="Error al enviar el correo")

    return {"status": "success", "mensaje": "Código enviado"}


@router.post("/{usuario_id}/validar-codigo-correo")
def validar_codigo_correo_endpoint(usuario_id: str, datos: ValidarCodigoCorreo):
    valido = validar_codigo_verificacion_correo(usuario_id, datos.codigo)
    if not valido:
        raise HTTPException(status_code=400, detail="Código inválido o expirado")
    return {"status": "success", "mensaje": "Correo verificado"}