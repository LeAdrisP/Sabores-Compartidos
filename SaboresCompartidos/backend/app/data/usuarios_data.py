import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Inicializar la app de Firebase Admin usando tus credenciales de proyecto
# Nota: Recuerda colocar tu archivo 'firebase-credentials.json' descargado de la consola en la raíz.
try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
except ValueError:
    # Evita errores si la app ya fue inicializada en otra sección del backend
    pass

# Instanciar cliente de Firestore
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
        # Primero verificamos que el correo no esté registrado previamente
        if buscar_usuario_por_correo(correo) is not None:
            print("El correo ya se encuentra registrado.")
            return {"error": "El usuario ya existe"}

        # Estructura de mapeo exacta solicitada por tu base de datos
        nuevo_usuario = {
            "correo": str(correo),
            "contrasena": str(contrasena),
            "confirmarContrasena": str(confirmar_contrasena)
        }

        # Guardar en la colección 'usuarios'. Firebase generará el ID aleatorio automáticamente
        usuarios_ref = db.collection("usuarios")
        doc_ref = usuarios_ref.add(nuevo_usuario)
        
        # Obtenemos el ID asignado (ej: feH9uXrHe0lZ5Ud1XtvC) y lo retornamos junto con los datos
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
    