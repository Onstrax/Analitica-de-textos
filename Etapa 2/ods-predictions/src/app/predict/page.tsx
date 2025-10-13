'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clasificarDatos } from '@/services/apiService';

export default function ClasificarPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultFiles, setResultFiles] = useState<{name: string, data: Blob}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setResultFiles([]);
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

  const handleEnviar = async () => {
    if (files.length === 0) {
      alert('Por favor, selecciona al menos un archivo');
      return;
    }

    setIsProcessing(true);
    
    try {
      const results = await clasificarDatos(files);
      setResultFiles(results);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar los archivos. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDescargar = () => {
    if (resultFiles.length === 0) return;

    resultFiles.forEach((result, index) => {
      // Usar setTimeout para espaciar las descargas y evitar que el navegador las bloquee
      setTimeout(() => {
        const url = window.URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, index * 200); // 100ms entre cada descarga
    });
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
          Clasificación de datos nuevos
        </h1>

        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda: Subir datos + Botón Enviar */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Subir datos sin etiquetar */}
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-[#3D3149] rounded-3xl p-12 flex flex-col items-center justify-center gap-8 cursor-pointer transition-all h-[500px] ${
                isDragging ? 'bg-[#4A3D56] scale-105' : 'hover:bg-[#4A3D56]'
              }`}
            >
              <h2 className="text-[#CADCFF] text-4xl font-semibold text-center flex-shrink-0">
                Subir datos<br />sin etiquetar
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
                  <div className="w-full h-full max-h-[120px] overflow-y-auto space-y-2 px-2">
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
            </div>
            
            {/* Botón Enviar */}
            <button
              onClick={handleEnviar}
              disabled={files.length === 0 || isProcessing}
              className="bg-[#3D3149] text-[#CADCFF] text-2xl font-semibold py-4 rounded-2xl hover:bg-[#4A3D56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {isProcessing ? 'Procesando...' : 'Enviar'}
            </button>
          </div>

          {/* Columna derecha: Descargar predicciones + Botón Descargar */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Descargar predicciones */}
            <div className="bg-[#3D3149] rounded-3xl p-12 flex flex-col items-center justify-center gap-8 h-[500px]">
              <h2 className="text-[#CADCFF] text-4xl font-semibold text-center flex-shrink-0">
                Descargar<br />predicciones
              </h2>
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image
                  src="/download.svg"
                  alt="Descargar predicciones"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                {isProcessing && (
                  <div className="text-[#CADCFF] text-lg text-center w-full">
                    Procesando...
                  </div>
                )}
                {resultFiles.length > 0 && !isProcessing && (
                  <div className="w-full h-full max-h-[120px] overflow-y-auto space-y-2 px-2">
                    {resultFiles.map((result, index) => (
                      <div 
                        key={index}
                        className="text-[#CADCFF] text-sm px-3 py-2 bg-[#27232B] rounded-lg flex justify-between items-center gap-2"
                      >
                        <span className="truncate">{result.name}</span>
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
                )}
              </div>
            </div>
            
            {/* Botón Descargar */}
            <button
              onClick={handleDescargar}
              disabled={resultFiles.length === 0}
              className="bg-[#3D3149] text-[#CADCFF] text-2xl font-semibold py-4 rounded-2xl hover:bg-[#4A3D56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              Descargar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}