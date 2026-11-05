import base64
import binascii

from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel

from roboflow_client import (
    RoboflowAuthError,
    RoboflowConfigError,
    RoboflowError,
    detectar_reciclavel,
)

app = FastAPI(title="Cata-Lixo API")

TAMANHO_MAXIMO = 8 * 1024 * 1024  # 8 MB


class FotoBase64(BaseModel):
    imagem_base64: str


def _processar(conteudo: bytes) -> dict:
    if not conteudo:
        raise HTTPException(status_code=400, detail="A foto veio vazia.")
    if len(conteudo) > TAMANHO_MAXIMO:
        raise HTTPException(status_code=413, detail="Foto grande demais (máximo 8 MB).")

    try:
        return detectar_reciclavel(conteudo)
    except RoboflowConfigError:
        raise HTTPException(status_code=500, detail="Servidor sem a chave do Roboflow configurada.")
    except RoboflowAuthError:
        raise HTTPException(status_code=502, detail="O serviço de detecção recusou a chave de API.")
    except RoboflowError as erro:
        raise HTTPException(status_code=502, detail=str(erro))


@app.get("/saude")
def saude():
    return {"status": "ok"}


@app.post("/detectar")
def detectar(foto: UploadFile = File(...)):
    return _processar(foto.file.read())


@app.post("/detectar-base64")
def detectar_base64(corpo: FotoBase64):
    try:
        conteudo = base64.b64decode(corpo.imagem_base64, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=400, detail="Imagem base64 inválida.")
    return _processar(conteudo)