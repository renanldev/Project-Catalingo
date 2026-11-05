import base64
import os
import time

import requests

WORKSPACE = "renans-workspace-eh9fl"
WORKFLOW_ID = "cata-lixo-1-rfdetr-small-t1-vcata-lixo-1-rfdetr-small-t1-logic"
URL = f"https://serverless.roboflow.com/{WORKSPACE}/workflows/{WORKFLOW_ID}"

TIMEOUT_SEGUNDOS = 30
TENTATIVAS = 3

# Classes do modelo. "O" e "X" ficam de fora de propósito.
MATERIAIS = {"Lata", "Tampa", "plastic-bottles"}
ESTADOS = {"sana", "danada", "defectuosa"}

CONFIANCA_MINIMA = 0.40   # abaixo disso a detecção é descartada
LIMIAR_CONFIAVEL = 0.60   # abaixo disso o app deve avisar "não tenho certeza"


class RoboflowError(Exception):
    """Base de todos os erros desta integração."""


class RoboflowConfigError(RoboflowError):
    """Chave de API não configurada."""


class RoboflowAuthError(RoboflowError):
    """O Roboflow recusou a chave (401/403)."""


class RoboflowRequestError(RoboflowError):
    """Falha de rede, timeout ou erro HTTP."""


class RoboflowResponseError(RoboflowError):
    """A resposta veio num formato inesperado."""


def detectar_reciclavel(imagem_bytes: bytes) -> dict:
    """Envia a foto ao workflow e devolve material, estado e caixa do objeto."""
    chave = os.environ.get("ROBOFLOW_API_KEY")
    if not chave:
        raise RoboflowConfigError("Variável de ambiente ROBOFLOW_API_KEY não definida.")

    corpo = {
        "inputs": {
            "image": {"type": "base64", "value": base64.b64encode(imagem_bytes).decode()}
        }
    }
    headers = {"Authorization": f"Bearer {chave}"}

    ultimo_erro = "desconhecido"
    for tentativa in range(1, TENTATIVAS + 1):
        try:
            resp = requests.post(URL, headers=headers, json=corpo, timeout=TIMEOUT_SEGUNDOS)
        except (requests.Timeout, requests.ConnectionError) as erro:
            ultimo_erro = f"falha de rede ({type(erro).__name__})"
        else:
            if resp.status_code in (401, 403):
                raise RoboflowAuthError("O Roboflow recusou a chave de API.")
            if resp.status_code == 429 or resp.status_code >= 500:
                ultimo_erro = f"Roboflow respondeu {resp.status_code}"
            elif resp.status_code >= 400:
                raise RoboflowRequestError(f"Requisição inválida ({resp.status_code}).")
            else:
                try:
                    dados = resp.json()
                except ValueError as erro:
                    raise RoboflowResponseError("A resposta não é um JSON válido.") from erro
                return _interpretar(dados)

        if tentativa < TENTATIVAS:
            time.sleep(2 ** (tentativa - 1))  # espera 1s, depois 2s

    raise RoboflowRequestError(f"Falha após {TENTATIVAS} tentativas: {ultimo_erro}.")


def _extrair_saida(dados: dict) -> dict:
    try:
        saida = dados["outputs"][0]
    except (KeyError, IndexError, TypeError) as erro:
        raise RoboflowResponseError("Resposta sem 'outputs'.") from erro

    # Não fixamos o nome do output: pegamos o primeiro que traga uma lista 'predictions'.
    for valor in saida.values():
        if isinstance(valor, dict) and isinstance(valor.get("predictions"), list):
            return valor
    raise RoboflowResponseError("Nenhum output com detecções foi encontrado.")


def _melhor(deteccoes: list, nomes: set):
    # .get porque já vimos detecções chegarem sem o campo "class"
    candidatas = [
        d for d in deteccoes
        if d.get("class") in nomes and d.get("confidence", 0) >= CONFIANCA_MINIMA
    ]
    return max(candidatas, key=lambda d: d["confidence"], default=None)


def _resumo(det):
    if det is None:
        return None
    return {"nome": det["class"], "confianca": round(det["confidence"], 2)}


def _caixa(det):
    # No Roboflow, x e y são o CENTRO da caixa. Aqui convertemos pro canto superior esquerdo.
    if det is None:
        return None
    try:
        return {
            "esquerda": round(det["x"] - det["width"] / 2),
            "topo": round(det["y"] - det["height"] / 2),
            "largura": round(det["width"]),
            "altura": round(det["height"]),
        }
    except KeyError:
        return None


def _interpretar(dados: dict) -> dict:
    saida = _extrair_saida(dados)
    deteccoes = saida["predictions"]
    imagem = saida.get("image") or {}

    material = _melhor(deteccoes, MATERIAIS)
    estado = _melhor(deteccoes, ESTADOS)

    return {
        "material": _resumo(material),
        "estado": _resumo(estado),
        "confiavel": material is not None and material["confidence"] >= LIMIAR_CONFIAVEL,
        "caixa": _caixa(material),
        "imagem": {"largura": imagem.get("width"), "altura": imagem.get("height")},
    }