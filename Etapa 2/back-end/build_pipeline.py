import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report, accuracy_score
import joblib
from custom_transformers import TextProcessor, WordCounter

# --- CONSTRUCCIÓN Y ENTRENAMIENTO DEL PIPELINE ---
print("\nIniciando construcción del pipeline...")

df = pd.read_excel('./Datos_proyecto(3).xlsx')

X = df[['textos']]
y = df['labels']

# Dividir datos, estratificando por la variable objetivo
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Definir las ramas de procesamiento
text_branch = Pipeline(steps=[
    ('processor', TextProcessor()),
    ('tfidf', TfidfVectorizer())
])
numeric_branch = Pipeline(steps=[
    ('counter', WordCounter()),
    ('scaler', StandardScaler())
])

# Combinar ramas con ColumnTransformer
preprocessor = ColumnTransformer(
    transformers=[
        ('text', text_branch, 'textos'),
        ('numeric', numeric_branch, 'textos')
    ])

# Crear el pipeline final con el clasificador LinearSVC
final_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('clf', LinearSVC(dual=True, random_state=42))
])

# Entrenar el pipeline
print("Entrenando el pipeline...")
final_pipeline.fit(X_train, y_train)
print("Entrenamiento completado.")

# evaluacion modelo
print("\nEvaluando el modelo en el conjunto de prueba...")
y_pred = final_pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")
print("\nReporte de Clasificación:")
report_dict = classification_report(y_test, y_pred, output_dict=True)
print(classification_report(y_test, y_pred))

#exportar pipeline
print("\nExportando el pipeline a 'classification_pipeline.joblib'...")
joblib.dump(final_pipeline, 'classification_pipeline.joblib')
print("Pipeline exportado exitosamente.")

# Exportar métricas
print("\nExportando las métricas a 'model_metrics.joblib'...")
joblib.dump(report_dict, 'model_metrics.joblib')
print("Métricas exportadas exitosamente.")
print(f"\nMétricas guardadas:")
print(f"  - Accuracy: {report_dict['accuracy']:.4f}")
print(f"  - Precision (macro avg): {report_dict['macro avg']['precision']:.4f}")
print(f"  - Recall (macro avg): {report_dict['macro avg']['recall']:.4f}")
print(f"  - F1-score (macro avg): {report_dict['macro avg']['f1-score']:.4f}")