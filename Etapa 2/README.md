# *Analitica-de-textos*  
# **Segunda entrega: Automatización y despliegue de modelos**  

## **Entregables**  
* Aumentación de datos y reentrenamiento del modelo  
* Automatización del proceso (pipeline, persistencia y API REST)  
* Aplicación web con interfaz para el usuario final  
* Video de máximo 5 minutos mostrando la interacción con la aplicación y los resultados  
* Documento con las respuestas y justificaciones solicitadas en la guía  

---

## **Asignación de roles**  
| **Rol**                              | **Nombre**                   | **Código**   |
|--------------------------------------|------------------------------|--------------|
| **Líder de proyecto**                | Juan Esteban Álvarez García  | 202212030    |
| **Ingeniero de software (frontend)** | Juan Esteban Álvarez García  | 202212030    |
| **Líder de negocio y documentación** | Camilo Inoue Rudas           | 202225593    |
| **Ingeniero de datos / backend**     | Iván Arturo Ávila            | 202216280    |

---

## **Asignación de tareas**  

### **Juan Esteban Álvarez García**  
| **Tarea** | **Tiempo dedicado** |
|------------|--------------------|
| Desarrollar la interfaz web de la aplicación utilizando Next.js | 4 horas |
| Implementar la comunicación del frontend con los endpoints del backend | 2 horas |
| Diseñar la estructura visual y navegación básica del sitio | 1 hora |
| Coordinar entregables del grupo y subir la versión final al repositorio | 0.5 horas |
| Implementar Aumentación de datos y comparar resultados | 2 horas |

---

### **Camilo Inoue Rudas**  
| **Tarea** | **Tiempo dedicado** |
|------------|--------------------|
| Elaborar la documentación técnica y argumentativa del proyecto (etapa 2) | 1 hora |
| Redactar las respuestas de la sección 3 (recursos informáticos y riesgos de uso) | 1 hora |
| Describir el rol del usuario y la conexión con el proceso de negocio | .5 horas |
| Revisar la coherencia del documento y preparar el texto para la wiki | .5 horas |
| Colaborar en la preparación del video explicativo de la aplicación | 1 hora |

---

### **Iván Arturo Ávila**  
| **Tarea** | **Tiempo dedicado** |
|------------|--------------------|
| Desarrollar los endpoints principales del backend (predicción y reentrenamiento) | 1 hora |
| Configurar Docker para la ejecución del proyecto | 30 min |
| Implementar el pipeline automatizado de preparación, entrenamiento y persistencia del modelo | 2 horas  |
| Asegurar el manejo de logs y validación de entradas en la API | 30 min |
| Pruebas de funcionamiento y corrección de errores en el backend | 1 hora |

---

## **Reuniones y comunicación**  
Debido a la disponibilidad limitada de horarios comunes entre los integrantes, se decidió mantener la misma dinámica de trabajo establecida en la primera etapa: comunicación activa y constante a través de un grupo de **WhatsApp**, compartiendo avances, código y documentos mediante el repositorio de **GitHub**.  

---

## **Posibles mejoras al equipo**  
El trabajo del equipo se desarrolló de manera organizada y con buena comunicación. Cada integrante asumió su rol con responsabilidad, lo que permitió cumplir con los entregables sin mayores contratiempos.  

Una posible mejora sería **establecer puntos de control intermedios** con fechas límite internas, para facilitar la verificación anticipada de compatibilidad entre el frontend, el backend y la documentación antes de la entrega final.  

---

## **Distribución de puntos**  
Considerando el compromiso, la calidad de las contribuciones, el cumplimiento de tareas y la participación equitativa en el proyecto:  
* Se distribuyen equitativamente los **100 puntos** entre los tres integrantes, asignando **33.3 puntos a cada uno**.  

---

## **Uso de Inteligencia Artificial**  

### **Juan Esteban Álvarez García**  
*  Utilicé IA generativa para la función de Aumetación de datos y para la implementación en Next del frontend basado en un diseño que hice a mano.

### **Camilo Inoue Rudas**  
*  Utilicé IA generativa para la revisión de sintáxis y organización de las ideas y respuestas propuestas en este archivo. Además, se usó para solucionar problemas de ejecución de la aplicación, tales como edición de variables de entorno.

### **Iván Arturo Ávila**  
*  utilicé inteligencia artificial generativa para comprender el flujo del pipeline y los distintos tipos de re-entrenamiento, así como para entender la gestión de archivos (la conversión de XLSX/CSV a JSON) y su manejo en los endpoints de la API.

## **Recursos informáticos requeridos**

Para el desarrollo y despliegue de la aplicación analítica, se requiere un conjunto de recursos informáticos que garanticen el correcto funcionamiento del modelo y su disponibilidad para el usuario final. En primer lugar, para el **entrenamiento y reentrenamiento del modelo**, basta con un entorno de cómputo con procesador de al menos cuatro núcleos (por ejemplo, Intel i5 o Ryzen 5) y una memoria RAM mínima de 8 GB. Esto se debe a que el modelo se construyó utilizando la librería *scikit-learn*, la cual está optimizada para ejecutar operaciones sobre CPU sin necesidad de aceleración por GPU. En caso de manejar volúmenes de datos más grandes o requerir procesos más intensivos durante la aumentación con *prompting*, se puede optar por utilizar entornos con GPU, como los ofrecidos por Google Colab o Kaggle.

Para la **ejecución y predicción**, los requerimientos son considerablemente menores. Un entorno con 2 GB de RAM y un procesador estándar es suficiente para ejecutar el modelo, dado que las predicciones son realizadas en tiempo casi real y los modelos persistidos en formato `.pkl` o `.joblib` son ligeros y eficientes. A nivel de software, se requiere tener instalado *Python 3.10+* y las librerías *FastAPI*, *Uvicorn*, *scikit-learn*, *pandas*, *numpy* y *joblib*. 

En cuanto a la **persistencia del modelo**, este se almacena como un archivo binario dentro del repositorio o en un servidor local. Para ambientes de producción, se recomienda guardar el archivo del modelo en un sistema de almacenamiento en la nube, como AWS S3 o Google Cloud Storage, con un sistema simple de versionamiento (por ejemplo, `modelo_v1.joblib`, `modelo_v2.joblib`) que permita mantener trazabilidad entre iteraciones. 

Finalmente, para el **despliegue de la aplicación**, se utiliza el framework *FastAPI*, que permite exponer dos endpoints principales: uno para realizar predicciones y otro para ejecutar procesos de reentrenamiento. La aplicación puede ejecutarse localmente mediante el comando `uvicorn main:app --reload`, o desplegarse en servicios gratuitos como Render, Railway o HuggingFace Spaces. En caso de optar por un despliegue en la nube, los requerimientos mínimos del servidor son 1 CPU virtual, 512 MB de RAM y 1 GB de almacenamiento. Con estas configuraciones, el sistema puede garantizar un funcionamiento eficiente, estable y replicable.


## **Riesgos para el usuario final**

El uso de la aplicación analítica conlleva ciertos riesgos que pueden clasificarse en tres categorías principales: técnicos, éticos y operacionales. En cuanto a los **riesgos técnicos**, uno de los principales es la posibilidad de que el modelo genere predicciones incorrectas o sesgadas, especialmente si los datos de entrenamiento presentan desbalance o representaciones limitadas de las distintas clases. Esto podría llevar a clasificaciones erróneas respecto a los Objetivos de Desarrollo Sostenible (ODS) a los que se asocian las opiniones. Para mitigar este riesgo, se implementan estrategias de aumentación de datos y validación cruzada que mejoran la capacidad de generalización del modelo. Otro riesgo técnico es la posible interrupción del servicio debido a errores en el servidor o en la API; para prevenirlo, se incluyen mecanismos de validación de entradas y registro de logs que permiten identificar y corregir fallos de manera oportuna.

Desde el punto de vista **ético**, un riesgo importante es la malinterpretación de los resultados. El usuario podría asumir que la clasificación generada por el modelo es una verdad absoluta, cuando en realidad se trata de una predicción probabilística basada en patrones del conjunto de datos. Por esta razón, la aplicación muestra la probabilidad asociada a cada predicción y recomienda interpretar los resultados como una herramienta de apoyo, no como una decisión definitiva. Además, se debe tener precaución con la **privacidad de los datos** ingresados por los usuarios, ya que los textos pueden contener información sensible. Para mitigar este riesgo, se recomienda anonimizar o eliminar cualquier referencia personal antes de almacenarlos o utilizarlos para reentrenar el modelo.

Finalmente, en términos **operacionales**, existe el riesgo de que la organización o el usuario final desarrollen una dependencia excesiva del modelo, utilizando sus resultados sin una revisión humana crítica. Esto podría derivar en decisiones incorrectas o parciales. Para evitarlo, se promueve un enfoque de *human-in-the-loop*, donde la aplicación actúa como una herramienta de apoyo al análisis, y no como un sustituto del criterio profesional. En conjunto, estas medidas buscan garantizar que el uso de la aplicación sea seguro, ético y confiable, tanto desde la perspectiva técnica como desde la social.



# Proyecto de Clasificación de ODS con API REST

La API incluye un endpoint (/retrain) que permite actualizar el modelo de clasificación con nuevos datos etiquetados. A continuación, se describen las estrategias de re-entrenamiento investigadas para este proyecto.

## 1. Re-entrenamiento Completo

  Combina los datos de entrenamiento originales con el nuevo lote de datos y entrena un modelo desde cero con todo el conjunto.

  Ventaja: Produce el modelo más robusto, ya que aprende de toda la información histórica y nueva.

  Desventaja: Es el método más lento y costoso en términos de recursos computacionales, especialmente con grandes volúmenes de datos.

## 2. Re-entrenamiento con Nuevos Lotes

  Entrena un modelo completamente nuevo utilizando únicamente el lote de datos más reciente. Este nuevo modelo reemplaza por completo a la versión anterior.

  Ventaja: Es un método rápido que permite al modelo adaptarse ágilmente a las tendencias más recientes en los datos.

  Desventaja: El modelo puede "olvidar" patrones aprendidos de los datos históricos si no están presentes en el nuevo lote.

## 3. Aprendizaje Incremental (Online Learning)

   Actualiza el modelo existente con los nuevos datos sin necesidad de re-entrenar desde cero. Se logra con algoritmos que soportan el método partial_fit.

  Ventaja: Es extremadamente rápido y eficiente, ideal para sistemas que reciben datos en tiempo real.

  Desventaja: No todos los modelos son compatibles (incluyendo LinearSVC). La calidad del modelo puede degradarse con el tiempo.

## Estrategia Implementada

Para este proyecto, se implementó la estrategia de Re-entrenamiento con Nuevos Lotes.

El endpoint /retrain recibe un nuevo conjunto de datos, entrena un modelo desde cero solo con esa información (aplicando un balanceo de clases por oversampling) y reemplaza el archivo .joblib anterior. Esta decisión ofrece el mejor balance entre agilidad para adaptarse a nuevos datos y eficiencia en el uso de recursos.

## Prerrequisitos

- Docker instalado y en ejecución.
- Python 3.9+ 

## Cómo Ejecutar el Proyecto


## 1. Clonar el Repositorio

```bash
git clone https://github.com/Onstrax/Analitica-de-textos.git
cd Analitica-de-textos
```
```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3. Crear el Modelo

Generar el archivo del pipeline:
```bash
cd etapa2/back-end
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









