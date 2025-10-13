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
| Desarrollar la interfaz web de la aplicación utilizando FastAPI Templates / HTML y CSS |  |
| Implementar la comunicación del frontend con los endpoints del backend |  |
| Diseñar la estructura visual y navegación básica del sitio |  |
| Realizar pruebas de integración entre frontend y backend |  |
| Coordinar entregables del grupo y subir la versión final al repositorio |  |

---

### **Camilo Inoue Rudas**  
| **Tarea** | **Tiempo dedicado** |
|------------|--------------------|
| Elaborar la documentación técnica y argumentativa del proyecto (etapa 2) |  |
| Redactar las respuestas de la sección 3 (recursos informáticos y riesgos de uso) |  |
| Describir el rol del usuario y la conexión con el proceso de negocio |  |
| Revisar la coherencia del documento y preparar el texto para la wiki |  |
| Colaborar en la preparación del video explicativo de la aplicación |  |

---

### **Iván Arturo Ávila**  
| **Tarea** | **Tiempo dedicado** |
|------------|--------------------|
| Desarrollar los endpoints principales del backend (predicción y reentrenamiento) |  |
| Configurar Docker para la ejecución del proyecto |  |
| Implementar el pipeline automatizado de preparación, entrenamiento y persistencia del modelo |  |
| Asegurar el manejo de logs y validación de entradas en la API |  |
| Pruebas de funcionamiento y corrección de errores en el backend |  |

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
*  

### **Camilo Inoue Rudas**  
*  

### **Iván Arturo Ávila**  
*  



# Proyecto de Clasificación de ODS con API REST

Este proyecto implementa un pipeline de Machine Learning para clasificar textos según los Objetivos de Desarrollo Sostenible (ODS). La solución está desplegada como una API REST utilizando FastAPI y Docker.

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
python -m venv .venv
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



