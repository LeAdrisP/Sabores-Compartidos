from firebase_admin import firestore

db = firestore.client()

def usuario_dio_like(receta_id: str, usuario_id: str) -> bool:
    try:
        doc = db.collection("likes").document(f"{receta_id}_{usuario_id}").get()
        return doc.exists
    except Exception as e:
        print(f"Error al verificar like: {e}")
        return False


def alternar_like(receta_id: str, usuario_id: str) -> dict | None:
    try:
        like_id = f"{receta_id}_{usuario_id}"
        like_ref = db.collection("likes").document(like_id)
        receta_ref = db.collection("recetas").document(receta_id)

        receta_doc = receta_ref.get()
        if not receta_doc.exists:
            return None

        ya_tiene_like = like_ref.get().exists

        if ya_tiene_like:
            like_ref.delete()
            receta_ref.update({"likes": firestore.Increment(-1)})
            nuevo_estado = False
        else:
            like_ref.set({"receta_id": receta_id, "usuario_id": usuario_id})
            receta_ref.update({"likes": firestore.Increment(1)})
            nuevo_estado = True

        likes_actualizados = receta_ref.get().to_dict().get("likes", 0)

        return {"liked": nuevo_estado, "likes": likes_actualizados}
    except Exception as e:
        print(f"Error al alternar like: {e}")
        return None

def usuario_marco_favorito(receta_id: str, usuario_id: str) -> bool:
    try:
        doc = db.collection("favoritos").document(f"{receta_id}_{usuario_id}").get()
        return doc.exists
    except Exception as e:
        print(f"Error al verificar favorito: {e}")
        return False

def alternar_favorito(receta_id: str, usuario_id: str) -> dict | None:
    try:
        fav_id = f"{receta_id}_{usuario_id}"
        fav_ref = db.collection("favoritos").document(fav_id)

        receta_doc = db.collection("recetas").document(receta_id).get()
        if not receta_doc.exists:
            return None

        ya_es_favorito = fav_ref.get().exists

        if ya_es_favorito:
            fav_ref.delete()
            nuevo_estado = False
        else:
            fav_ref.set({"receta_id": receta_id, "usuario_id": usuario_id})
            nuevo_estado = True

        return {"favorito": nuevo_estado}
    except Exception as e:
        print(f"Error al alternar favorito: {e}")
        return None

def obtener_recetas_favoritas(usuario_id: str) -> list:
    try:
        favoritos_ref = db.collection("favoritos").where("usuario_id", "==", usuario_id).stream()
        return [doc.to_dict()["receta_id"] for doc in favoritos_ref]
    except Exception as e:
        print(f"Error al obtener favoritos: {e}")
        return []