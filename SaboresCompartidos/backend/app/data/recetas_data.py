import firebase_admin
from firebase_admin import firestore
import datetime
import base64

db = firestore.client()


def convertir_imagen_a_base64(archivo_bytes: bytes, content_type: str) -> str:
    """
    Convierte los bytes de la imagen a una cadena Base64 con el prefijo
    de tipo MIME, lista para guardarse directo en Firestore y ser usada
    como src de una imagen en el frontend sin pasos adicionales.
    """
    base64_str = base64.b64encode(archivo_bytes).decode('utf-8')
    return f"data:{content_type};base64,{base64_str}"


def crear_receta(datos: dict, imagen_base64: str | None) -> dict | None:
    """
    Guarda una nueva receta en Firestore con todos sus campos,
    incluyendo la lista de ingredientes, pasos de preparación,
    y la imagen codificada en Base64 si fue proporcionada.
    """
    try:
        usuario_doc = db.collection("usuarios").document(datos["usuario_id"]).get()
        autor_nombre = "Usuario"
        if usuario_doc.exists:
            autor_nombre = usuario_doc.to_dict().get("nombre") or "Usuario"

        nueva_receta = {
            "titulo": datos["titulo"],
            "descripcion": datos["descripcion"],
            "tiempo_aproximado": datos["tiempo_aproximado"],
            "dificultad": datos["dificultad"],
            "porciones": datos["porciones"],
            "categoria": datos["categoria"],
            "momento_dia": datos["momento_dia"],
            "tipo_platillo": datos["tipo_platillo"],
            "ingredientes": datos["ingredientes"],
            "preparacion": datos["preparacion"],
            "usuario_id": datos["usuario_id"],
            "autor_nombre": autor_nombre,
            "imagen_url": imagen_base64,
            "fecha_creacion": datetime.datetime.now().isoformat(),
            "likes": 0,
            "comentarios_count": 0
        }

        doc_ref = db.collection("recetas").add(nueva_receta)
        nueva_receta["id"] = doc_ref[1].id
        return nueva_receta
    except Exception as e:
        print(f"Error al crear receta: {e}")
        return None


def obtener_todas_las_recetas() -> list:
    """
    Obtiene todas las recetas publicadas, ordenadas de la más reciente
    a la más antigua, para mostrarlas en el feed de Explorar.
    """
    try:
        recetas_ref = db.collection("recetas").order_by(
            "fecha_creacion", direction=firestore.Query.DESCENDING
        ).stream()

        recetas = []
        for doc in recetas_ref:
            data = doc.to_dict()
            data["id"] = doc.id
            recetas.append(data)
        return recetas
    except Exception as e:
        print(f"Error al obtener recetas: {e}")
        return []


def obtener_recetas_por_usuario(usuario_id: str) -> list:
    """
    Obtiene únicamente las recetas publicadas por un usuario específico,
    usado en la pantalla de 'Mis recetas' y en el perfil.
    """
    try:
        recetas_ref = db.collection("recetas").where("usuario_id", "==", usuario_id).stream()

        recetas = []
        for doc in recetas_ref:
            data = doc.to_dict()
            data["id"] = doc.id
            recetas.append(data)
        return recetas
    except Exception as e:
        print(f"Error al obtener recetas del usuario: {e}")
        return []


def obtener_receta_por_id(receta_id: str) -> dict | None:
    """
    Obtiene los datos completos de una receta específica por su ID,
    usado en la vista de detalle.
    """
    try:
        doc = db.collection("recetas").document(receta_id).get()
        if doc.exists:
            data = doc.to_dict()
            data["id"] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error al obtener receta: {e}")
        return None