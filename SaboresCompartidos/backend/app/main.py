from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 👇 Importamos el enrutador modular que procesará el flujo
from routes.auth_routes import router as auth_router  # ✅

app = FastAPI(
    title="API de Sabores Compartidos",
    description="Servicio web colaborativo enfocado en la publicación, exploración y organización de recetas de cocina dentro de una comunidad interactiva.",
    version="1.0.0"
)

# Configuración de CORS para la comunicación con Angular y ngrok
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 👇 REGISTRAMOS EL ROUTER: Activa el prefijo /api/auth de tu arquitectura
app.include_router(auth_router)

@app.get("/")
def inicio():
    return {
        "mensaje": "Backend FastAPI de Sabores Compartidos funcionando correctamente"
    }