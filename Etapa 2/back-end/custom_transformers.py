import pandas as pd
import numpy as np
import re
import string
import unicodedata
import nltk
import spacy
from sklearn.base import BaseEstimator, TransformerMixin
from nltk.corpus import stopwords

try:
    nlp = spacy.load("es_core_news_sm")
except OSError:
    print("Descargando modelo 'es_core_news_sm' de spaCy...")
    from spacy.cli import download
    download("es_core_news_sm")
    nlp = spacy.load("es_core_news_sm")

try:
    stopwords.words('spanish')
except LookupError:
    nltk.download('stopwords', quiet=True)

stop_words_es = set(stopwords.words('spanish'))

# Procesamiento
def preprocesar_texto(texto: str) -> str:
    texto = str(texto).lower()
    texto = unicodedata.normalize("NFC", texto)
    texto = texto.translate(str.maketrans('', '', string.punctuation))
    texto = re.sub(r'\d+|http\S+|@\w+|#', '', texto)
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

def eliminar_stopwords(texto: str) -> str:
    palabras = texto.split()
    return ' '.join([p for p in palabras if p not in stop_words_es])

def lematizar_texto(texto: str) -> str:
    doc = nlp(texto)
    return " ".join([token.lemma_ for token in doc])

def contar_palabras(texto: str) -> int:
    return len(str(texto).split())

class TextProcessor(BaseEstimator, TransformerMixin):
    """Aplica la secuencia de limpieza y preprocesamiento a una columna de texto."""
    def fit(self, X, y=None):
        return self
    def transform(self, X, y=None):
        return X.apply(preprocesar_texto).apply(eliminar_stopwords).apply(lematizar_texto)

class WordCounter(BaseEstimator, TransformerMixin):
    """Cuenta las palabras y devuelve el resultado en formato para Scikit-learn."""
    def fit(self, X, y=None):
        return self
    def transform(self, X, y=None):
        return X.apply(contar_palabras).values.reshape(-1, 1)