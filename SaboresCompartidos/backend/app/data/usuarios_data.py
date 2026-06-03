# Lista goblal que simula nuestra base de datos de usuarios

usuarios_db = [
    {
        "id": 1,
        "nombre": "Ana García",
        "username": "anag",
        "email": "ana@correo.com",
        # Contraseña encriptada (ejemplo)
        "contrasena": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36XU86Q31Z5vG17E9AWhVOm", 
        "rol": "usuario"
    }
]

def buscar_usuario_por_correo(correo = str) -> dict | None: 
    """Busca en la lista simulada si existe un usuario registrado con ese correo."""
    for usuario in usuarios_db:
        if usuario["email"] == correo:
            return usuario
    return None

    