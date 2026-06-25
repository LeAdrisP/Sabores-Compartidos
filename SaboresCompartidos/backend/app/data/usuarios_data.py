import firebase_admin
import random
import datetime
from firebase_admin import credentials
from firebase_admin import firestore

try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()

def buscar_usuario_por_correo(correo: str) -> dict | None: 
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

def generar_y_guardar_codigo(correo: str) -> str | None:
    usuario = buscar_usuario_por_correo(correo)
    if usuario is None:
        return None

    codigo = str(random.randint(100000, 999999))
    expiracion = datetime.datetime.now() + datetime.timedelta(minutes=10)

    db.collection("usuarios").document(usuario["id"]).update({
        "codigo_verificacion": codigo,
        "codigo_expiracion": expiracion.isoformat()
    })

    return codigo

def validar_codigo(correo: str, codigo_ingresado: str) -> dict | None:
    usuario = buscar_usuario_por_correo(correo)
    if usuario is None:
        return None

    codigo_guardado = usuario.get("codigo_verificacion")
    expiracion_str = usuario.get("codigo_expiracion")

    if not codigo_guardado or not expiracion_str:
        return None

    expiracion = datetime.datetime.fromisoformat(expiracion_str)
    if datetime.datetime.now() > expiracion:
        return None

    if codigo_guardado != codigo_ingresado:
        return None

    return usuario

def actualizar_contrasena(usuario_id: str, nueva_contrasena: str) -> bool:
    try:
        db.collection("usuarios").document(usuario_id).update({
            "contrasena": nueva_contrasena,
            "codigo_verificacion": None,
            "codigo_expiracion": None
        })
        return True
    except Exception as e:
        print(f"Error al actualizar contraseña: {e}")
        return False   

def validar_contrasena_actual(usuario_id: str, contrasena: str) -> bool:
    try:
        doc = db.collection("usuarios").document(usuario_id).get()
        if not doc.exists:
            return False
        data = doc.to_dict()
        return data.get("contrasena") == contrasena
    except Exception as e:
        print(f"Error al validar contraseña: {e}")
        return False

def cambiar_contrasena(usuario_id: str, nueva_contrasena: str) -> bool:
    try:
        db.collection("usuarios").document(usuario_id).update({
            "contrasena": nueva_contrasena
        })
        return True
    except Exception as e:
        print(f"Error al cambiar contraseña: {e}")
        return False

def generar_codigo_verificacion_correo(usuario_id: str) -> str | None:
    try:
        doc = db.collection("usuarios").document(usuario_id).get()
        if not doc.exists:
            return None

        codigo = str(random.randint(100000, 999999))
        expiracion = datetime.datetime.now() + datetime.timedelta(minutes=10)

        db.collection("usuarios").document(usuario_id).update({
            "codigo_verificacion_correo": codigo,
            "codigo_verificacion_correo_expiracion": expiracion.isoformat()
        })

        return codigo
    except Exception as e:
        print(f"Error al generar código de verificación de correo: {e}")
        return None

def validar_codigo_verificacion_correo(usuario_id: str, codigo_ingresado: str) -> bool:
    try:
        doc = db.collection("usuarios").document(usuario_id).get()
        if not doc.exists:
            return False

        data = doc.to_dict()
        codigo_guardado = data.get("codigo_verificacion_correo")
        expiracion_str = data.get("codigo_verificacion_correo_expiracion")

        if not codigo_guardado or not expiracion_str:
            return False

        expiracion = datetime.datetime.fromisoformat(expiracion_str)
        if datetime.datetime.now() > expiracion:
            return False

        if codigo_guardado != codigo_ingresado:
            return False

        db.collection("usuarios").document(usuario_id).update({
            "correo_verificado": True,
            "codigo_verificacion_correo": None,
            "codigo_verificacion_correo_expiracion": None
        })

        return True
    except Exception as e:
        print(f"Error al validar código de correo: {e}")
        return False