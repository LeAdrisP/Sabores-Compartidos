from fastapi import APIRouter, HTTPException, status
from models.usuario_model import RegistroUsuario, LoginUsuario
from data.usuarios_data import registrar_nuevo_usuario, buscar_usuario_por_correo
from core.email_service import enviar_codigo_verificacion
from data.usuarios_data import generar_y_guardar_codigo, validar_codigo, actualizar_contrasena
from models.usuario_model import SolicitarCodigo, ValidarCodigo, RestablecerContrasena

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

@router.post("/recuperar/solicitar")
def solicitar_codigo(datos: SolicitarCodigo):
    codigo = generar_y_guardar_codigo(datos.correo)
    if codigo is None:
        raise HTTPException(status_code=404, detail="No existe una cuenta con ese correo")

    enviado = enviar_codigo_verificacion(datos.correo, codigo)
    if not enviado:
        raise HTTPException(status_code=500, detail="Error al enviar el correo")

    return {"status": "success", "mensaje": "Código enviado"}


@router.post("/recuperar/restablecer")
def restablecer_contrasena(datos: RestablecerContrasena):
    usuario = validar_codigo(datos.correo, datos.codigo)
    if usuario is None:
        raise HTTPException(status_code=400, detail="Código inválido o expirado")

    exito = actualizar_contrasena(usuario["id"], datos.nueva_contrasena)
    if not exito:
        raise HTTPException(status_code=500, detail="Error al actualizar la contraseña")

    return {"status": "success", "mensaje": "Contraseña actualizada"}