import io

import pandas as pd
from fastapi import FastAPI, File, UploadFile

app = FastAPI(title="Strata Insight API")


@app.get("/")
def health_check():
    return {"status": "online", "modulo": "ingestao"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))  # Funciona para CSV
    return {
        "filename": file.filename,
        "columns": df.columns.tolist(),
        "preview": df.head(3).to_dict(),
    }
