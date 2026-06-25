from data.interacciones_data import alternar_like, usuario_dio_like

from data.interacciones_data import (
    alternar_favorito,
    usuario_marco_favorito,
    obtener_recetas_favoritas
)

def procesar_toggle_like(receta_id: str, usuario_id: str) -> dict | None:
    return alternar_like(receta_id, usuario_id)

def verificar_like(receta_id: str, usuario_id: str) -> bool:
    return usuario_dio_like(receta_id, usuario_id)  

def procesar_toggle_favorito(receta_id: str, usuario_id: str) -> dict | None:
    return alternar_favorito(receta_id, usuario_id)

def verificar_favorito(receta_id: str, usuario_id: str) -> bool:
    return usuario_marco_favorito(receta_id, usuario_id)

def listar_ids_favoritos(usuario_id: str) -> list:
    return obtener_recetas_favoritas(usuario_id)