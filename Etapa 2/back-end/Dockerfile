FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    python -m spacy download es_core_news_sm

COPY main.py .
COPY custom_transformers.py .  
COPY classification_pipeline.joblib .
COPY model_metrics.joblib .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]