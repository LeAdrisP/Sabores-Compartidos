from fastapi import APIRouter, HTTPException
from models.interacciones_model import LikeToggle
from services.interacciones_service import procesar_toggle_like, verificar_like

from services.interacciones_service import (
    procesar_toggle_favorito,
    verificar_favorito,
    listar_ids_favoritos
)

router = APIRouter(
    prefix="/api/interacciones",
    tags=["Interacciones"]
)

@router.post("/likes/{receta_id}")
def toggle_like(receta_id: str, datos: LikeToggle):
    resultado = procesar_toggle_like(receta_id, datos.usuario_id)
    if resultado is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return resultado

@router.get("/likes/{receta_id}/{usuario_id}")
def consultar_like(receta_id: str, usuario_id: str):
    liked = verificar_like(receta_id, usuario_id)
    return {"liked": liked}      

@router.post("/favoritos/{receta_id}")
def toggle_favorito(receta_id: str, datos: LikeToggle):
    resultado = procesar_toggle_favorito(receta_id, datos.usuario_id)
    if resultado is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return resultado

@router.get("/favoritos/{receta_id}/{usuario_id}")
def consultar_favorito(receta_id: str, usuario_id: str):
    favorito = verificar_favorito(receta_id, usuario_id)
    return {"favorito": favorito}

@router.get("/favoritos/usuario/{usuario_id}")
def obtener_favoritos_usuario(usuario_id: str):
    ids = listar_ids_favoritos(usuario_id)
    return {"recetas_ids": ids}    