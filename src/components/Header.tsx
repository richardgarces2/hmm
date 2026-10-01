import React from 'react';
import {
  HeartPulse,
  AlertTriangle,
  Search,
  Download,
  Stethoscope,
  Plus,
} from 'lucide-react';
import { ActiveTab } from '../types/medical';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSOS: () => void;
  onOpenNewRecord: () => void;
  onOpenSearch: () => void;
  onOpenAssistant: () => void;
  onOpenBackup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSOS,
  onOpenNewRecord,
  onOpenSearch,
  onOpenAssistant,
  onOpenBackup,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'overview', label: 'Resumen' },
    { id: 'consultations', label: 'Consultas' },
    { id: 'medications', label: 'Medicamentos' },
    { id: 'vitals', label: 'Signos Vitales' },
    { id: 'vaccines', label: 'Vacunas' },
    { id: 'allergies', label: 'Alergias y Crónicas' },
    { id: 'labs', label: 'Laboratorios' },
  ];

  return (
    <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark with icon */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              SaludFamiliar
            </span>
          </div>

          {/* Zone 2: 4-6 Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-sm font-medium transition-colors cursor-pointer py-1 relative ${
                    isActive
                      ? 'text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Buscar en todo el historial familiar (Ctrl+K)"
              aria-label="Buscar en historial"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAssistant}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer whitespace-nowrap"
              title="Asistente de Consulta y Guía Médica"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
              <span>Guía Médica</span>
            </button>

            <button
              onClick={onOpenBackup}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Copia de seguridad y Exportar datos"
              aria-label="Copia de seguridad"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSOS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Ficha SOS</span>
            </button>

            <button
              onClick={onOpenNewRecord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
