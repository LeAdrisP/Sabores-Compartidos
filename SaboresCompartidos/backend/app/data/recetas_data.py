import firebase_admin
from firebase_admin import firestore
import datetime
import base64

db = firestore.client()

def convertir_imagen_a_base64(archivo_bytes: bytes, content_type: str) -> str:
    base64_str = base64.b64encode(archivo_bytes).decode('utf-8')
    return f"data:{content_type};base64,{base64_str}"

def crear_receta(datos: dict, imagen_base64: str | None) -> dict | None:
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

def actualizar_receta(receta_id: str, usuario_id: str, datos: dict, imagen_base64: str | None) -> dict | None:
    try:
        doc_ref = db.collection("recetas").document(receta_id)
        doc = doc_ref.get()

        if not doc.exists:
            return None

        receta_actual = doc.to_dict()
        if receta_actual.get("usuario_id") != usuario_id:
            return {"error": "No tienes permiso para editar esta receta"}

        datos_actualizados = {
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
        }

        if imagen_base64:
            datos_actualizados["imagen_url"] = imagen_base64

        doc_ref.update(datos_actualizados)

        actualizado = doc_ref.get().to_dict()
        actualizado["id"] = receta_id
        return actualizado
    except Exception as e:
        print(f"Error al actualizar receta: {e}")
        return None

def eliminar_receta(receta_id: str, usuario_id: str) -> dict:
    try:
        doc_ref = db.collection("recetas").document(receta_id)
        doc = doc_ref.get()

        if not doc.exists:
            return {"error": "Receta no encontrada"}

        receta_actual = doc.to_dict()
        if receta_actual.get("usuario_id") != usuario_id:
            return {"error": "No tienes permiso para eliminar esta receta"}

        doc_ref.delete()
        return {"status": "success"}
    except Exception as e:
        print(f"Error al eliminar receta: {e}")
        return {"error": "Error interno al eliminar"}

def obtener_top_recetas_usuario(usuario_id: str, limite: int = 4) -> list:
    try:
        recetas_ref = db.collection("recetas").where("usuario_id", "==", usuario_id).stream()

        recetas = []
        for doc in recetas_ref:
            data = doc.to_dict()
            data["id"] = doc.id
            recetas.append(data)

        recetas_ordenadas = sorted(recetas, key=lambda r: r.get("likes", 0), reverse=True)
        recetas_con_likes = [r for r in recetas_ordenadas if r.get("likes", 0) > 0]

        return recetas_con_likes[:limite]
    except Exception as e:
        print(f"Error al obtener top recetas: {e}")
        return []