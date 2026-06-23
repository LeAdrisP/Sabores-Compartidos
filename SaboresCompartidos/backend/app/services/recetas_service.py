from data.recetas_data import (
    convertir_imagen_a_base64,
    crear_receta,
    obtener_todas_las_recetas,
    obtener_recetas_por_usuario,
    obtener_receta_por_id
)


def procesar_creacion_receta(form_data: dict, imagen_bytes: bytes | None, content_type: str | None) -> dict | None:
    """
    Orquesta la creación de una receta: convierte la imagen a Base64 si existe,
    luego guarda la receta completa en Firestore con la imagen incluida.
    """
    imagen_base64 = None
    if imagen_bytes and content_type:
        imagen_base64 = convertir_imagen_a_base64(imagen_bytes, content_type)

    return crear_receta(form_data, imagen_base64)


def listar_recetas_feed() -> list:
    """Retorna todas las recetas para el feed de Explorar."""
    return obtener_todas_las_recetas()


def listar_recetas_de_usuario(usuario_id: str) -> list:
    """Retorna las recetas publicadas por un usuario en particular."""
    return obtener_recetas_por_usuario(usuario_id)


def obtener_detalle_receta(receta_id: str) -> dict | None:
    """Retorna el detalle completo de una receta por su ID."""
    return obtener_receta_por_id(receta_id)