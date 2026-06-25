from data.recetas_data import (
    convertir_imagen_a_base64,
    crear_receta,
    obtener_todas_las_recetas,
    obtener_recetas_por_usuario,
    obtener_receta_por_id
)

from data.recetas_data import actualizar_receta, eliminar_receta
from data.recetas_data import obtener_top_recetas_usuario

def procesar_creacion_receta(form_data: dict, imagen_bytes: bytes | None, content_type: str | None) -> dict | None:
    imagen_base64 = None
    if imagen_bytes and content_type:
        imagen_base64 = convertir_imagen_a_base64(imagen_bytes, content_type)

    return crear_receta(form_data, imagen_base64)

def listar_recetas_feed() -> list:
    return obtener_todas_las_recetas()

def listar_recetas_de_usuario(usuario_id: str) -> list:
    return obtener_recetas_por_usuario(usuario_id)


def obtener_detalle_receta(receta_id: str) -> dict | None:
    return obtener_receta_por_id(receta_id)

def procesar_actualizacion_receta(receta_id: str, usuario_id: str, form_data: dict, imagen_bytes: bytes | None, content_type: str | None) -> dict | None:
    imagen_base64 = None
    if imagen_bytes and content_type:
        imagen_base64 = convertir_imagen_a_base64(imagen_bytes, content_type)

    return actualizar_receta(receta_id, usuario_id, form_data, imagen_base64)

def procesar_eliminacion_receta(receta_id: str, usuario_id: str) -> dict:
    return eliminar_receta(receta_id, usuario_id)

def listar_top_recetas_usuario(usuario_id: str) -> list:
    return obtener_top_recetas_usuario(usuario_id)