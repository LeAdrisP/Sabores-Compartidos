from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_routes import router as auth_router
from routes.usuarios_routes import router as usuarios_router

app = FastAPI(
    title="API de Sabores Compartidos",
    description="Servicio web colaborativo enfocado en la publicación, exploración y organización de recetas de cocina dentro de una comunidad interactiva.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(usuarios_router)  # 👈 ahora sí, después de crear app

@app.get("/")
def inicio():
    return {
        "mensaje": "Backend FastAPI de Sabores Compartidos funcionando correctamente"
    }