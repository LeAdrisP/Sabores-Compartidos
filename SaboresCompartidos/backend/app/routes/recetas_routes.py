from fastapi import APIRouter, HTTPException, UploadFile, Form, File
from typing import Optional
import json

from services.recetas_service import (
    procesar_creacion_receta,
    listar_recetas_feed,
    listar_recetas_de_usuario,
    obtener_detalle_receta
)

router = APIRouter(
    prefix="/api/recetas",
    tags=["Recetas"]
)


@router.post("/")
async def publicar_receta(
    titulo: str = Form(...),
    descripcion: str = Form(...),
    tiempo_aproximado: str = Form(...),
    dificultad: str = Form(...),
    porciones: int = Form(...),
    categoria: str = Form(...),
    momento_dia: str = Form(...),
    tipo_platillo: str = Form(...),
    ingredientes: str = Form(...),
    preparacion: str = Form(...),
    usuario_id: str = Form(...),
    imagen: Optional[UploadFile] = File(None)
):
    """
    Recibe el formulario completo de creación de receta (multipart/form-data
    para poder incluir la imagen), convierte la imagen a Base64 si existe,
    y guarda la receta en Firestore.
    """
    try:
        ingredientes_list = json.loads(ingredientes)
        preparacion_list = json.loads(preparacion)
    except Exception:
        raise HTTPException(status_code=400, detail="Formato inválido en ingredientes o preparación")

    form_data = {
        "titulo": titulo,
        "descripcion": descripcion,
        "tiempo_aproximado": tiempo_aproximado,
        "dificultad": dificultad,
        "porciones": porciones,
        "categoria": categoria,
        "momento_dia": momento_dia,
        "tipo_platillo": tipo_platillo,
        "ingredientes": ingredientes_list,
        "preparacion": preparacion_list,
        "usuario_id": usuario_id
    }

    imagen_bytes = None
    content_type = None
    if imagen:
        imagen_bytes = await imagen.read()
        content_type = imagen.content_type

    resultado = procesar_creacion_receta(form_data, imagen_bytes, content_type)

    if resultado is None:
        raise HTTPException(status_code=500, detail="Error al publicar la receta")

    return {"status": "success", "mensaje": "Receta publicada exitosamente", "receta": resultado}


@router.get("/")
def obtener_feed():
    """Retorna todas las recetas para mostrar en el feed de Explorar."""
    recetas = listar_recetas_feed()
    return {"recetas": recetas}


@router.get("/usuario/{usuario_id}")
def obtener_recetas_usuario(usuario_id: str):
    """Retorna las recetas publicadas por un usuario específico."""
    recetas = listar_recetas_de_usuario(usuario_id)
    return {"recetas": recetas}


@router.get("/{receta_id}")
def obtener_receta(receta_id: str):
    """Retorna el detalle completo de una receta por su ID."""
    receta = obtener_detalle_receta(receta_id)
    if receta is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta