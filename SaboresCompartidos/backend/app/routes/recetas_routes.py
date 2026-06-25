from fastapi import APIRouter, HTTPException, UploadFile, Form, File
from typing import Optional
import json

from services.recetas_service import (
    procesar_creacion_receta,
    listar_recetas_feed,
    listar_recetas_de_usuario,
    obtener_detalle_receta
)

from services.recetas_service import procesar_actualizacion_receta, procesar_eliminacion_receta
from services.recetas_service import listar_top_recetas_usuario

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
    recetas = listar_recetas_feed()
    return {"recetas": recetas}

@router.get("/buscar/filtrar")
def buscar_recetas_filtradas(
    texto: Optional[str] = None,
    dificultad: Optional[str] = None,
    categoria: Optional[str] = None,
    tiempo_max: Optional[int] = None,
    porciones_min: Optional[int] = None,
    porciones_max: Optional[int] = None
):
    recetas = listar_recetas_feed()

    if texto:
        texto_lower = texto.lower()
        recetas = [r for r in recetas if texto_lower in r.get("titulo", "").lower()]

    if dificultad and dificultad != "Todas":
        recetas = [r for r in recetas if r.get("dificultad") == dificultad]

    if categoria and categoria != "Todas":
        recetas = [r for r in recetas if r.get("momento_dia") == categoria]

    if tiempo_max:
        def extraer_minutos(tiempo_str: str) -> int:
            try:
                return int(''.join(filter(str.isdigit, tiempo_str.split()[0])))
            except Exception:
                return 9999
        recetas = [r for r in recetas if extraer_minutos(r.get("tiempo_aproximado", "")) <= tiempo_max]

    if porciones_min is not None:
        recetas = [r for r in recetas if r.get("porciones", 0) >= porciones_min]

    if porciones_max is not None:
        recetas = [r for r in recetas if r.get("porciones", 0) <= porciones_max]

    return {"recetas": recetas}

@router.get("/usuario/{usuario_id}")
def obtener_recetas_usuario(usuario_id: str):
    recetas = listar_recetas_de_usuario(usuario_id)
    return {"recetas": recetas}

@router.get("/usuario/{usuario_id}/top")
def obtener_top_usuario(usuario_id: str):
    recetas = listar_top_recetas_usuario(usuario_id)
    return {"recetas": recetas}

@router.get("/{receta_id}")
def obtener_receta(receta_id: str):
    receta = obtener_detalle_receta(receta_id)
    if receta is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta

@router.put("/{receta_id}")
async def editar_receta(
    receta_id: str,
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
    }

    imagen_bytes = None
    content_type = None
    if imagen:
        imagen_bytes = await imagen.read()
        content_type = imagen.content_type

    resultado = procesar_actualizacion_receta(receta_id, usuario_id, form_data, imagen_bytes, content_type)

    if resultado is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    if "error" in resultado:
        raise HTTPException(status_code=403, detail=resultado["error"])

    return {"status": "success", "mensaje": "Receta actualizada exitosamente", "receta": resultado}


@router.delete("/{receta_id}")
def eliminar_receta_endpoint(receta_id: str, usuario_id: str):
    resultado = procesar_eliminacion_receta(receta_id, usuario_id)

    if "error" in resultado:
        detail = resultado["error"]
        status_code = 403 if "permiso" in detail else 404
        raise HTTPException(status_code=status_code, detail=detail)

    return {"status": "success", "mensaje": "Receta eliminada exitosamente"}