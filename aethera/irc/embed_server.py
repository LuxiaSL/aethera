"""
Minimal OpenAI-compatible /v1/embeddings server (sentence-transformers).

This is NOT part of the core package runtime — it runs on **the GPU node**, in the
user's `~/luxi-files/.venv-shared` (which has torch+CUDA, transformers,
sentence-transformers, fastapi/uvicorn). It exists because the GPU node's production
vLLM (conda env `blackwell`) can't serve embeddings (a flashinfer-cubin version
bug), so we host embeddings directly. `aethera/irc/semantic_dedup.py` calls this
endpoint (default http://localhost:8001/v1).

Deploy (scp this file to the GPU node:~/luxi-files/, then):
  CUDA_VISIBLE_DEVICES=1 PORT=8001 EMBED_MODEL=BAAI/bge-large-en-v1.5 \
    HF_HOME=~/luxi-files/.hf-cache setsid nohup \
    ~/luxi-files/.venv-shared/bin/python embed_server.py > embed_server.log 2>&1 &
  # reachable from the laptop over the VPN at the node's :8001 (like :8000).

bge-large is 512-token context; for long (two-act) fragments swap EMBED_MODEL for
a bigger-context model (e.g. Alibaba-NLP/gte-large-en-v1.5, nomic — 8192 tokens).
"""
import os
from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import uvicorn

MODEL_NAME = os.environ.get("EMBED_MODEL", "BAAI/bge-large-en-v1.5")
SERVED = os.environ.get("SERVED_NAME", "bge-large")
PORT = int(os.environ.get("PORT", "8001"))

print(f"loading {MODEL_NAME} on cuda ...", flush=True)
model = SentenceTransformer(MODEL_NAME, device="cuda")
print(f"loaded. dim={model.get_sentence_embedding_dimension()}", flush=True)

app = FastAPI()


class EmbReq(BaseModel):
    model: str = SERVED
    input: Union[str, List[str]]


@app.get("/v1/models")
def models():
    return {"object": "list", "data": [{"id": SERVED, "object": "model"}]}


@app.post("/v1/embeddings")
def embeddings(req: EmbReq):
    texts = [req.input] if isinstance(req.input, str) else req.input
    vecs = model.encode(texts, normalize_embeddings=True, convert_to_numpy=True, batch_size=64)
    data = [
        {"object": "embedding", "embedding": v.tolist(), "index": i}
        for i, v in enumerate(vecs)
    ]
    return {
        "object": "list",
        "data": data,
        "model": req.model,
        "usage": {"prompt_tokens": 0, "total_tokens": 0},
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="warning")
