import base64, os, sys, requests

URL = ("https://serverless.roboflow.com/renans-workspace-eh9fl/workflows/"
       "cata-lixo-1-rfdetr-small-t1-vcata-lixo-1-rfdetr-small-t1-logic")

with open(sys.argv[1], "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

resp = requests.post(
    URL,
    headers={"Authorization": f"Bearer {os.environ['ROBOFLOW_API_KEY']}"},
    json={"inputs": {"image": {"type": "base64", "value": img_b64}}},
    timeout=60,
)
resp.raise_for_status()

deteccoes = resp.json()["outputs"][0]["predictions"]["predictions"]
if not deteccoes:
    print("nenhuma detecção")
for det in deteccoes:
    print(det.get("class", "(sem nome)"), round(det["confidence"], 2))