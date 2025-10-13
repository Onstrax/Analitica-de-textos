const API_BASE_URL = 'http://tu-api-backend.com/api';
// src/services/apiService.ts

/**
 * Servicio falso para clasificar datos
 * Simula una llamada a la API que toma 2 segundos y devuelve los archivos tal cual
 */
export async function clasificarDatos(files: File[]): Promise<{name: string, data: Blob}[]> {
  // Simular delay de 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Devolver los archivos tal cual, pero con un nuevo nombre que indique que fueron procesados
  const results = files.map(file => ({
    name: `clasificado_${file.name}`,
    data: new Blob([file], { type: file.type })
  }));
  
  return results;
}

/**
 * Servicio falso para re-entrenar el modelo
 * Simula una llamada a la API que toma 3 segundos
 */
export async function reentrenarModelo(files: File[], variableObjetivo: string): Promise<void> {
  // Simular delay de 3 segundos
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Modelo re-entrenado con:', {
    numArchivos: files.length,
    archivos: files.map(f => f.name),
    variableObjetivo
  });
  
  // No devuelve nada, solo completa exitosamente
}

/**
 * Servicio falso para obtener métricas del modelo
 * Devuelve métricas aleatorias para simular el comportamiento
 */
export async function obtenerMetricas(): Promise<{
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
}> {
  // Simular delay de 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generar métricas aleatorias entre 0 y 1
  return {
    precision: Math.random(),
    recall: Math.random(),
    f1Score: Math.random(),
    accuracy: Math.random()
  };
}

/**
 * Cuando tengas tu API real, reemplaza las funciones anteriores con algo como esto:
 * 
 * export async function clasificarDatos(files: File[]): Promise<{name: string, data: Blob}[]> {
 *   const formData = new FormData();
 *   files.forEach((file, index) => {
 *     formData.append(`file_${index}`, file);
 *   });
 * 
 *   const response = await fetch('TU_API_ENDPOINT/clasificar', {
 *     method: 'POST',
 *     body: formData,
 *   });
 * 
 *   if (!response.ok) {
 *     throw new Error('Error al procesar los archivos');
 *   }
 * 
 *   const data = await response.json();
 *   return data.files;
 * }
 * 
 * export async function reentrenarModelo(files: File[], variableObjetivo: string): Promise<void> {
 *   const formData = new FormData();
 *   files.forEach((file, index) => {
 *     formData.append(`file_${index}`, file);
 *   });
 *   formData.append('variable_objetivo', variableObjetivo);
 * 
 *   const response = await fetch('TU_API_ENDPOINT/reentrenar', {
 *     method: 'POST',
 *     body: formData,
 *   });
 * 
 *   if (!response.ok) {
 *     throw new Error('Error al re-entrenar el modelo');
 *   }
 * }
 * 
 * export async function obtenerMetricas(): Promise<{
 *   precision: number;
 *   recall: number;
 *   f1Score: number;
 *   accuracy: number;
 * }> {
 *   const response = await fetch('TU_API_ENDPOINT/metricas', {
 *     method: 'GET',
 *   });
 * 
 *   if (!response.ok) {
 *     throw new Error('Error al obtener métricas');
 *   }
 * 
 *   return await response.json();
 * }
 */