import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()

def buscar_usuario_por_correo(correo: str) -> dict | None: 
    """
    Busca en tiempo real dentro de Firestore si ya existe una cuenta con ese correo
    para evitar registros duplicados.
    """
    try:
        usuarios_ref = db.collection("usuarios")
        query = usuarios_ref.where("correo", "==", correo).limit(1).stream()
        
        for doc in query:
            usuario_data = doc.to_dict()
            usuario_data["id"] = doc.id
            return usuario_data
            
        return None
    except Exception as e:
        print(f"Error al buscar usuario en Firestore: {e}")
        return None


def registrar_nuevo_usuario(correo: str, contrasena: str, confirmar_contrasena: str) -> dict | None:
    """
    Guarda de manera definitiva un nuevo usuario en la colección de Firebase
    con los campos estructurados exactamente como strings.
    """
    try:
        if buscar_usuario_por_correo(correo) is not None:
            print("El correo ya se encuentra registrado.")
            return {"error": "El usuario ya existe"}
 
        nuevo_usuario = {
            "correo": str(correo),
            "contrasena": str(contrasena),
            "confirmar_contrasena": str(confirmar_contrasena),
            "nombre": "",
            "nombre_usuario": "",
            "biografia": "",
            "ubicacion": "",
            "contrasena_actual": "",
            "nueva_contrasena": "",
            "recetas": 0,
            "seguidores": 0,
            "seguiendo": 0
        }

        usuarios_ref = db.collection("usuarios")
        doc_ref = usuarios_ref.add(nuevo_usuario)
        nuevo_usuario["id"] = doc_ref[1].id
        print(f"Usuario registrado exitosamente en Firebase con ID: {nuevo_usuario['id']}")
        return nuevo_usuario

    except Exception as e:
        print(f"Error al registrar usuario en Firestore: {e}")
        return None

def obtener_usuario_por_id(usuario_id: str) -> dict | None:
    try:
        doc = db.collection("usuarios").document(usuario_id).get()
        if doc.exists:
            data = doc.to_dict()
            data["id"] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error al obtener usuario: {e}")
        return None

def actualizar_usuario(usuario_id: str, datos: dict) -> bool:
    try:
        db.collection("usuarios").document(usuario_id).update(datos)
        return True
    except Exception as e:
        print(f"Error al actualizar usuario: {e}")
        return False
    