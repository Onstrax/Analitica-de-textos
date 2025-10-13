## Comparación de Rendimiento: Modelo Original vs. Modelo Aumentado

A continuación se presenta un análisis detallado del rendimiento del clasificador LinearSVC antes y después de ser entrenado con un conjunto de datos enriquecido mediante prompting.

#### Tabla Comparativa de Métricas Globales

| Métrica | Modelo Original | Modelo Aumentado | Mejora |
| :--- | :---: | :---: | :---: |
| **Accuracy** | 88.46% | **100%** | +11.54% |
| **F1-Score (Macro)** | 88.22% | **100%** | +11.78% |
| **Precision (Macro)** | 90.00% | **100%** | +10.00% |
| **Recall (Macro)** | 88.00% | **100%** | +12.00% |

---

## Informes de Clasificación Detallados

#### Modelo Original (Entrenado con 99 Muestras)

| Clase | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: |
| 1 | 1.00 | 0.75 | 0.86 | 8 |
| 3 | 0.90 | 1.00 | 0.95 | 9 |
| 4 | 0.80 | 0.89 | 0.84 | 9 |
| **Macro Avg** | **0.90** | **0.88** | **0.88** | **26** |

**Matriz de Confusión - Original:**
| | Predicho ODS 1 | Predicho ODS 3 | Predicho ODS 4 |
| :--- | :---: | :---: | :---: |
| **Verdadero ODS 1** | 6 | 0 | 2 |
| **Verdadero ODS 3** | 0 | 9 | 0 |
| **Verdadero ODS 4** | 0 | 1 | 8 |

#### Modelo Aumentado (Entrenado con 204 Muestras)

| Clase | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: |
| 1 | 1.00 | 1.00 | 1.00 | 13 |
| 3 | 1.00 | 1.00 | 1.00 | 14 |
| 4 | 1.00 | 1.00 | 1.00 | 14 |
| **Macro Avg** | **1.00** | **1.00** | **1.00** | **41** |

**Matriz de Confusión - Aumentado:**
| | Predicho ODS 1 | Predicho ODS 3 | Predicho ODS 4 |
| :--- | :---: | :---: | :---: |
| **Verdadero ODS 1** | 13 | 0 | 0 |
| **Verdadero ODS 3** | 0 | 14 | 0 |
| **Verdadero ODS 4** | 0 | 0 | 14 |

---

## Interpretación y Discusión sobre Overfitting

Se observa que hubo una mejora en el rendimiento. El modelo original, aunque decente (F1-macro de 88.22%), mostraba **confusión entre las clases**, especialmente al clasificar erróneamente el 25% de los textos de ODS 1 (Recall de 0.75). El modelo aumentado, en cambio, eliminó por completo esta ambigüedad, alcanzando un **rendimiento perfecto** en el conjunto de validación.

Sin embargo, este puntaje perfecto puede ser un indicador de **overfitting**, lo que podría causar que el modelo pierda su capacidad de generalizar a datos nuevos y nunca antes vistos. En este caso, existía el riesgo de que el modelo hubiera aprendido a la perfección las peculiaridades de los textos sintéticos generados por la IA, pero que fallara ante textos reales con una redacción diferente.

---

## Validación Final y Conclusiones para el Negocio

Para descartar el sobreajuste, el **modelo aumentado fue validado con un segundo conjunto de datos** y verificado manualmente. Los resultados de esta validación confirmaron un rendimiento robusto, con solo **6 fallos en 100 predicciones.**

Esta validación final confirma dos puntos clave:

1.  **El modelo no está sobreajustado:** El excelente rendimiento se mantiene en datos nuevos, lo que demuestra que ha aprendido patrones generalizables y no solo ha memorizado el conjunto de entrenamiento.
2.  **La estrategia de prompting es un éxito:** El aumento de datos no solo mejoró las métricas, sino que creó un modelo **fiable y listo para producción**.

**Recomendación Final:** Se debe implementar el **modelo entrenado con los datos aumentados**. Esta estrategia ha probado ser una forma eficiente y rentable de superar la limitación de tener pocos datos etiquetados, permitiendo la creación de clasificadores de texto de alta precisión que pueden automatizar tareas, generar insights y respaldar la toma de decisiones con un alto grado de confianza.