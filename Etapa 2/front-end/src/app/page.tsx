import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#27232B] flex flex-col items-center justify-center p-8">
      <h1 className="text-[#CADCFF] text-6xl font-bold text-center mb-16">
        Clasificación de ODSs
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full h-[500px]">
        {/* Clasificar datos nuevos */}
        <Link 
          href="/predict"
          className="flex-1 bg-[#3D3149] rounded-3xl p-12 flex flex-col items-center justify-center gap-8 hover:bg-[#4A3D56] transition-colors cursor-pointer group"
        >
          <h2 className="text-[#CADCFF] text-5xl font-semibold text-center">
            Clasificar<br />datos nuevos
          </h2>
          <div className="relative w-50 h-50 opacity-90 group-hover:opacity-100 transition-opacity">
            <Image
              src="/classify.svg"
              alt="Clasificar datos"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Re-entrenar modelo */}
        <Link 
          href="/retrain"
          className="flex-1 bg-[#3D3149] rounded-3xl p-12 flex flex-col items-center justify-center gap-8 hover:bg-[#4A3D56] transition-colors cursor-pointer group"
        >
          <h2 className="text-[#CADCFF] text-5xl font-semibold text-center">
            Re-entrenar<br />modelo
          </h2>
          <div className="relative w-48 h-48 opacity-90 group-hover:opacity-100 transition-opacity">
            <Image
              src="/brain.svg"
              alt="Re-entrenar modelo"
              fill
              className="object-contain"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}