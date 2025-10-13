'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { reentrenarModelo, obtenerMetricas } from '@/services/apiService';

interface Metricas {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
}

export default function RetrainPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [variableObjetivo, setVariableObjetivo] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [isLoadingMetricas, setIsLoadingMetricas] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar métricas al montar el componente
  useEffect(() => {
    cargarMetricas();
  }, []);

  const cargarMetricas = async () => {
    setIsLoadingMetricas(true);
    try {
      const nuevasMetricas = await obtenerMetricas();
      setMetricas(nuevasMetricas);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
      alert('Error al cargar las métricas del modelo');
    } finally {
      setIsLoadingMetricas(false);
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const newFiles = Array.from(selectedFiles).filter(file => 
      validTypes.includes(file.type) || 
      file.name.endsWith('.csv') || 
      file.name.endsWith('.xlsx')
    );

    if (newFiles.length !== selectedFiles.length) {
      alert('Algunos archivos fueron omitidos. Solo se permiten archivos .csv o .xlsx');
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleReentrenar = async () => {
    if (files.length === 0) {
      alert('Por favor, selecciona al menos un archivo');
      return;
    }

    if (!variableObjetivo.trim()) {
      alert('Por favor, escribe la variable objetivo');
      return;
    }

    setIsProcessing(true);
    
    try {
      await reentrenarModelo(files, variableObjetivo);
      // alert('Modelo re-entrenado exitosamente');
      
      // Recargar métricas después del reentrenamiento
      await cargarMetricas();
      
      // Limpiar formulario
      setFiles([]);
      setVariableObjetivo('');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al re-entrenar el modelo. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#27232B] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Botón Volver */}
        <Link
          href="/"
          className="inline-block bg-[#3D3149] text-[#CADCFF] text-2xl font-semibold px-16 py-4 rounded-2xl hover:bg-[#4A3D56] transition-colors mb-8"
        >
          Volver
        </Link>

        {/* Título */}
        <h1 className="text-[#CADCFF] text-6xl font-bold text-center mb-12">
          Re-entrenar el modelo
        </h1>

        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Subir datos etiquetados */}
          <div className="flex-1">
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-[#3D3149] rounded-3xl p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all h-[500px] ${
                isDragging ? 'bg-[#4A3D56] scale-105' : 'hover:bg-[#4A3D56]'
              }`}
            >
              <h2 className="text-[#CADCFF] text-4xl font-semibold text-center flex-shrink-0">
                Subir datos<br />etiquetados
              </h2>
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image
                  src="/upload.svg"
                  alt="Subir datos"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                {files.length > 0 ? (
                  <div className="w-full h-full max-h-[100px] overflow-y-auto space-y-2 px-2">
                    {files.map((file, index) => (
                      <div 
                        key={index}
                        className="text-[#CADCFF] text-sm px-3 py-2 bg-[#27232B] rounded-lg flex justify-between items-center gap-2"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="text-red-400 hover:text-red-300 flex-shrink-0 text-lg font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <input
                type="text"
                value={variableObjetivo}
                onChange={(e) => setVariableObjetivo(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Escribir variable obj."
                className="w-full px-4 py-3 bg-[#CADCFF] text-[#27232B] text-lg rounded-xl placeholder-[#27232B]/60 focus:outline-none focus:ring-2 focus:ring-[#CADCFF]/50 flex-shrink-0"
              />
            </div>
          </div>

          {/* Métricas */}
          <div className="flex-1">
            <div className="bg-[#3D3149] rounded-3xl p-12 flex flex-col items-center justify-center gap-8 h-[500px]">
              <h2 className="text-[#CADCFF] text-4xl font-semibold text-center flex-shrink-0">
                Métricas
              </h2>
              {isLoadingMetricas ? (
                <div className="text-[#CADCFF] text-lg">Cargando métricas...</div>
              ) : metricas ? (
                <div className="flex flex-col gap-4 w-full text-[#CADCFF] text-2xl">
                  <div className="flex justify-between items-center">
                    <span>Precisión:</span>
                    <span className="font-semibold">{metricas.precision.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Recall:</span>
                    <span className="font-semibold">{metricas.recall.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>F1-score:</span>
                    <span className="font-semibold">{metricas.f1Score.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accuracy:</span>
                    <span className="font-semibold">{metricas.accuracy.toFixed(3)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[#CADCFF] text-lg">No hay métricas disponibles</div>
              )}
            </div>
          </div>
        </div>

        {/* Botón Re-entrenar */}
        <div className="flex justify-center">
          <button
            onClick={handleReentrenar}
            disabled={files.length === 0 || !variableObjetivo.trim() || isProcessing}
            className="bg-[#3D3149] text-[#CADCFF] text-2xl font-semibold px-16 py-4 rounded-2xl hover:bg-[#4A3D56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Re-entrenando...' : 'Re-entrenar'}
          </button>
        </div>
      </div>
    </div>
  );
}