// src/services/apiService.ts

// Cambia esto por la URL real de tu API de FastAPI
const API_BASE_URL = 'http://localhost:8000'; // Ajusta el puerto si es necesario

/**
 * Interfaz para las métricas del modelo
 */
export interface ModelMetrics {
  message: string;
  metrics: {
    accuracy: number;
    macro_avg?: {
      precision: number;
      recall: number;
      'f1-score': number;
      support: number;
    };
    weighted_avg?: {
      precision: number;
      recall: number;
      'f1-score': number;
      support: number;
    };
    [key: string]: any; // Para las métricas por clase (1, 3, 4)
  };
}

/**
 * Servicio para clasificar datos usando el endpoint /predict_files
 * Envía archivos Excel y recibe un ZIP con los resultados
 */
export async function clasificarDatos(files: File[]): Promise<{name: string, data: Blob}[]> {
  try {
    const formData = new FormData();
    
    // Añadir todos los archivos al FormData
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/predict_files`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    // La respuesta es un archivo ZIP
    const zipBlob = await response.blob();
    
    // Extraer archivos del ZIP
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(zipBlob);
    
    const results: {name: string, data: Blob}[] = [];
    
    // Iterar sobre cada archivo en el ZIP
    for (const [filename, file] of Object.entries(zip.files)) {
      if (!file.dir) {
        const blob = await file.async('blob');
        results.push({
          name: filename,
          data: blob
        });
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Error al clasificar datos:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Error desconocido al clasificar los archivos');
  }
}

/**
 * Servicio para re-entrenar el modelo usando el endpoint /retrain
 * Envía archivos con datos etiquetados y actualiza el modelo
 */
export async function reentrenarModelo(
  files: File[], 
  textColumn: string = 'textos',
  labelColumn: string = 'labels'
): Promise<ModelMetrics> {
  try {
    const formData = new FormData();
    
    // Añadir todos los archivos
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Añadir los nombres de las columnas
    formData.append('text_column', textColumn);
    formData.append('label_column', labelColumn);

    const response = await fetch(`${API_BASE_URL}/retrain`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const data: ModelMetrics = await response.json();
    
    console.log('Modelo re-entrenado exitosamente:', {
      mensaje: data.message,
      accuracy: data.metrics.accuracy,
      numArchivos: files.length
    });
    
    return data;
    
  } catch (error) {
    console.error('Error al re-entrenar modelo:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Error desconocido al re-entrenar el modelo');
  }
}

/**
 * Servicio para obtener métricas del modelo actual
 * NOTA: Tu API actual no tiene un endpoint específico para esto,
 * las métricas se devuelven después del re-entrenamiento.
 * Esta función es un placeholder para mantener la interfaz consistente.
 */
export async function obtenerMetricas(): Promise<{
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
}> {
  // Como tu API no tiene endpoint /metrics, devolvemos valores por defecto
  // Considera agregar un endpoint GET /metrics en tu FastAPI si lo necesitas
  console.warn('Endpoint /metrics no disponible. Devolviendo métricas por defecto.');
  
  return {
    precision: 0,
    recall: 0,
    f1Score: 0,
    accuracy: 0
  };
}

/**
 * Función auxiliar para parsear métricas del classification_report
 * Convierte el formato de sklearn al formato esperado por el frontend
 */
export function parsearMetricas(metricsData: ModelMetrics): {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  porClase?: {[key: string]: {precision: number, recall: number, f1Score: number, support: number}};
} {
  const { metrics } = metricsData;
  
  // Usar weighted_avg si está disponible, sino macro_avg
  const avg = metrics.weighted_avg || metrics.macro_avg;
  
  const resultado = {
    precision: avg?.precision || 0,
    recall: avg?.recall || 0,
    f1Score: avg?.['f1-score'] || 0,
    accuracy: metrics.accuracy || 0,
    porClase: {} as {[key: string]: {precision: number, recall: number, f1Score: number, support: number}}
  };
  
  // Extraer métricas por clase (1, 3, 4)
  ['1', '3', '4'].forEach(clase => {
    if (metrics[clase]) {
      resultado.porClase![`ODS ${clase}`] = {
        precision: metrics[clase].precision,
        recall: metrics[clase].recall,
        f1Score: metrics[clase]['f1-score'],
        support: metrics[clase].support
      };
    }
  });
  
  return resultado;
}

/**
 * Función para verificar el estado de la API
 */
export async function verificarEstadoAPI(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch (error) {
    console.error('API no disponible:', error);
    return false;
  }
}

/**
 * EJEMPLO DE USO:
 * 
 * // Clasificar archivos
 * const archivosClasificados = await clasificarDatos(files);
 * archivosClasificados.forEach(archivo => {
 *   // Descargar cada archivo
 *   const url = URL.createObjectURL(archivo.data);
 *   const a = document.createElement('a');
 *   a.href = url;
 *   a.download = archivo.name;
 *   a.click();
 * });
 * 
 * // Re-entrenar modelo
 * const metricas = await reentrenarModelo(files, 'textos', 'labels');
 * const metricasParseadas = parsearMetricas(metricas);
 * console.log('Accuracy:', metricasParseadas.accuracy);
 * console.log('F1-Score:', metricasParseadas.f1Score);
 * console.log('Métricas por clase:', metricasParseadas.porClase);
 */