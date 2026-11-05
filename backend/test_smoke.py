from pathlib import Path

from roboflow_client import MATERIAIS, detectar_reciclavel

FOTO = Path(__file__).resolve().parent.parent / "assets" / "images" / "latinhaIntacta.jpeg"


def test_detectar_reciclavel_retorna_as_chaves_esperadas():
    resultado = detectar_reciclavel(FOTO.read_bytes())

    assert set(resultado) == {"material", "estado", "confiavel", "caixa", "imagem"}
    assert set(resultado["imagem"]) == {"largura", "altura"}
    assert resultado["material"] is not None
    assert resultado["material"]["nome"] in MATERIAIS


if __name__ == "__main__":
    test_detectar_reciclavel_retorna_as_chaves_esperadas()
    print("OK: smoke test passou")