# Proyecto de Clasificación de ODS con API REST

Este proyecto implementa un pipeline de Machine Learning para clasificar textos según los Objetivos de Desarrollo Sostenible (ODS). La solución está desplegada como una API REST utilizando FastAPI y Docker.

## Prerrequisitos

- Docker instalado y en ejecución.
- Python 3.9+ 

## Cómo Ejecutar el Proyecto


## 1. Clonar el Repositorio

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd <NOMBRE_DE_LA_CARPETA>
```
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3. Crear el Modelo

Generar el archivo del pipeline:
```bash
python build_pipeline.py

```

Esto creará el archivo classification_pipeline.joblib en la carpeta del proyecto.

## 4. Construir la Imagen de Docker

Empaquetar API
```bash
docker build -t ods-classifier-api .
```

## 5. Ejecutar el Contenedor

Iniciar API
```bash
docker run -d -p 8000:8000 --name ods-api-container ods-classifier-api
```
