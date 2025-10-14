import joblib
import pandas as pd
import io
import zipfile
from pathlib import Path
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from collections import Counter
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.utils import resample 
from custom_transformers import TextProcessor, WordCounter

MODEL_PATH = "classification_pipeline.joblib"
METRICS_PATH = "model_metrics.joblib"  # Archivo para guardar las métricas

app = FastAPI(
    title="API de Clasificación de ODS",
    description="Sube archivos, clasifica textos, re-entrena el modelo y descarga los resultados.",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← Permite TODOS los orígenes
    allow_credentials=True,
    allow_methods=["*"],   # ← Permite todos los métodos
    allow_headers=["*"],   # ← Permite todos los headers
)
#balanceo

def balancear_dataset_oversampling(df: pd.DataFrame, columna_target: str) -> pd.DataFrame:
    """
    Aplica oversampling a las clases minoritarias para balancear el dataset.
    """
    distribucion = df[columna_target].value_counts()
    tamaño_objetivo = distribucion.max()
    
    dfs_balanceados = []
    for clase in distribucion.index:
        df_clase = df[df[columna_target] == clase]
        if len(df_clase) < tamaño_objetivo:
            df_clase_balanced = resample(
                df_clase,
                replace=True,
                n_samples=tamaño_objetivo,
                random_state=42
            )
            dfs_balanceados.append(df_clase_balanced)
        else:
            dfs_balanceados.append(df_clase)
            
    df_balanced = pd.concat(dfs_balanceados)
    return df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)

class MetricsResponse(BaseModel):
    message: str
    metrics: Dict[str, Any]

pipeline = None
current_metrics = None  # Variable global para almacenar las métricas actuales

@app.on_event("startup")
def load_model():
    global pipeline, current_metrics
    try:
        if Path(MODEL_PATH).exists():
            pipeline = joblib.load(MODEL_PATH)
            print(f"Pipeline cargado exitosamente desde '{MODEL_PATH}'.")
        else:
            print(f"Advertencia: No se encontró el archivo del modelo en '{MODEL_PATH}'.")
            pipeline = None
            
        # Cargar métricas si existen
        if Path(METRICS_PATH).exists():
            current_metrics = joblib.load(METRICS_PATH)
            print(f"Métricas cargadas exitosamente desde '{METRICS_PATH}'.")
        else:
            print(f"Advertencia: No se encontraron métricas guardadas en '{METRICS_PATH}'.")
            current_metrics = None
    except Exception as e:
        print(f" Error crítico al cargar el modelo: {e}")
        pipeline = None
        current_metrics = None

#endpoints

@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    """
    Retorna las métricas del modelo actual.
    Si no hay métricas disponibles, retorna un mensaje informativo.
    """
    global current_metrics
    
    if current_metrics is None:
        # Si no hay métricas guardadas, retornar métricas por defecto
        return MetricsResponse(
            message="No hay métricas disponibles. El modelo aún no ha sido entrenado o re-entrenado.",
            metrics={
                "accuracy": 0.0,
                "macro avg": {
                    "precision": 0.0,
                    "recall": 0.0,
                    "f1-score": 0.0,
                    "support": 0.0
                },
                "weighted avg": {
                    "precision": 0.0,
                    "recall": 0.0,
                    "f1-score": 0.0,
                    "support": 0.0
                }
            }
        )
    
    return MetricsResponse(
        message="Métricas del modelo actual.",
        metrics=current_metrics
    )

@app.post("/predict_files")
async def predict_files(files: List[UploadFile] = File(...)):
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible.")
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
        for file in files:
            try:
                contents = await file.read()
                file_buffer = io.BytesIO(contents)
                df = pd.read_excel(file_buffer)
                if 'textos' not in df.columns:
                    raise HTTPException(status_code=400, detail=f"El archivo '{file.filename}' no contiene la columna 'textos'.")
                predictions = pipeline.predict(df)
                df['prediccion_ods'] = predictions
                excel_buffer = io.BytesIO()
                df.to_excel(excel_buffer, index=False)
                excel_buffer.seek(0)
                output_filename = f"resultado_{file.filename}"
                zip_file.writestr(output_filename, excel_buffer.read())
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error procesando el archivo {file.filename}: {str(e)}")
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": f"attachment; filename=resultados.zip"}
    )

@app.post("/retrain", response_model=MetricsResponse)
async def retrain(
    files: List[UploadFile] = File(...),
    text_column: str = Form("textos"),
    label_column: str = Form("labels")
):
  
    global pipeline, current_metrics
    if pipeline is None:
        raise HTTPException(status_code=503, detail="No hay un modelo base para re-entrenar.")

    try:
        # 1. Leer y concatenar todos los archivos
        dfs = []
        for uf in files:
            contents = await uf.read()
            buffer = io.BytesIO(contents)
            filename = (uf.filename or "").lower()
            if filename.endswith(".csv"):
                df_part = pd.read_csv(buffer)
            elif filename.endswith((".xlsx", ".xls")):
                df_part = pd.read_excel(buffer)
            else:
                raise HTTPException(status_code=400, detail=f"Formato de archivo no soportado: {uf.filename}")
            dfs.append(df_part)

        if not dfs:
            raise HTTPException(status_code=400, detail="No se recibieron archivos para re-entrenar.")

        df_retrain = pd.concat(dfs, ignore_index=True)

        if text_column not in df_retrain.columns or label_column not in df_retrain.columns:
            raise HTTPException(status_code=400, detail=f"Los datos deben contener las columnas '{text_column}' y '{label_column}'.")


        print("Balanceando los datos de re-entrenamiento...")
        df_balanced = balancear_dataset_oversampling(df_retrain, columna_target=label_column)
        print("Distribución de clases después del balanceo:")
        print(df_balanced[label_column].value_counts())
        
        X = df_balanced[[text_column]].rename(columns={text_column: "textos"})
        y = df_balanced[label_column]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        new_pipeline = pipeline
        new_pipeline.fit(X_train, y_train)

        y_pred = new_pipeline.predict(X_test)
        report = classification_report(y_test, y_pred, output_dict=True)

        # Guardar el modelo y las métricas
        joblib.dump(new_pipeline, MODEL_PATH)
        joblib.dump(report, METRICS_PATH)
        
        pipeline = new_pipeline
        current_metrics = report
        
        print(f"Modelo re-entrenado y guardado en '{MODEL_PATH}'.")
        print(f"Métricas guardadas en '{METRICS_PATH}'.")

        return MetricsResponse(
            message="Modelo re-entrenado y actualizado con éxito (datos balanceados).",
            metrics=report
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocurrió un error inesperado durante el re-entrenamiento: {str(e)}")