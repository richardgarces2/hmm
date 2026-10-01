import React, { useRef } from 'react';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (fileContent: string) => void;
  onResetToDefault: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImport(content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Copias de Seguridad y Datos
              </h2>
              <p className="text-xs text-slate-500">
                Exporta o restaura todo el historial clínico familiar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-teal-600" />
                <span>Exportar Copia de Seguridad (.json)</span>
              </span>
              <button
                onClick={() => {
                  onExport();
                  onClose();
                }}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Descargar Archivo
              </button>
            </div>
            <p className="text-slate-500">
              Guarda todos los perfiles, vacunas, recetas, consultas y analíticas en un archivo JSON en tu dispositivo para máxima privacidad.
            </p>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Restaurar desde Archivo (.json)</span>
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Seleccionar Archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-slate-500">
              Carga un archivo de respaldo previamente descargado para restaurar el historial en cualquier momento.
            </p>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-red-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-red-600" />
                <span>Restablecer Datos de Demostración</span>
              </span>
              <button
                onClick={() => {
                  if (confirm('¿Deseas restablecer los datos de ejemplo iniciales de la familia Morales Gómez?')) {
                    onResetToDefault();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Restablecer
              </button>
            </div>
            <p className="text-red-700">
              Vuelve a cargar los expedientes clínicos de muestra con 4 miembros familiares y datos médicos realistas.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
