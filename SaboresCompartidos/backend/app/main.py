from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API de Sabores Compartidos",
    description="Servicio web colaborativa enfocada en la publicación, exploración y organización de recetas de cocina dentro de una comunidad interactiva.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")

def inicio():
    return{
        "mensaje": "Backend FastAPI de agenda de contactos funcionando correctamente"
    }
