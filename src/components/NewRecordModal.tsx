import React from 'react';
import {
  X,
  Stethoscope,
  Pill,
  HeartPulse,
  Syringe,
  AlertTriangle,
  Microscope,
} from 'lucide-react';
import { FamilyMember, ActiveTab } from '../types/medical';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
  onAction: (tab: ActiveTab) => void;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  members,
  selectedMemberId,
  onSelectMember,
  onAction,
}) => {
  if (!isOpen) return null;

  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const options: {
    id: ActiveTab;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'consultations',
      title: 'Consulta Médica',
      description: 'Registrar visita médica, diagnóstico, médico y tratamiento',
      icon: <Stethoscope className="w-5 h-5 text-teal-600" />,
      color: 'hover:border-teal-400 bg-teal-50/20',
    },
    {
      id: 'medications',
      title: 'Medicamento / Receta',
      description: 'Añadir fármaco activo, posología, horarios y control de pastillas',
      icon: <Pill className="w-5 h-5 text-blue-600" />,
      color: 'hover:border-blue-400 bg-blue-50/20',
    },
    {
      id: 'vitals',
      title: 'Signos Vitales',
      description: 'Anotar presión arterial, glucosa, frecuencia cardíaca, peso o IMC',
      icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
      color: 'hover:border-rose-400 bg-rose-50/20',
    },
    {
      id: 'vaccines',
      title: 'Vacuna / Inmunización',
      description: 'Registrar dosis de vacuna aplicada, lote y fecha de próximo refuerzo',
      icon: <Syringe className="w-5 h-5 text-purple-600" />,
      color: 'hover:border-purple-400 bg-purple-50/20',
    },
    {
      id: 'allergies',
      title: 'Alergia o Condición Crónica',
      description: 'Anotar intolerancias, patologías crónicas y protocolos de rescate',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      color: 'hover:border-amber-400 bg-amber-50/20',
    },
    {
      id: 'labs',
      title: 'Estudio de Laboratorio / Imagen',
      description: 'Subir análisis de sangre, ecografías, radiografías o informes',
      icon: <Microscope className="w-5 h-5 text-emerald-600" />,
      color: 'hover:border-emerald-400 bg-emerald-50/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Nuevo Registro en el Historial
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona el familiar y el tipo de evento médico que deseas registrar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member selector */}
        <div className="px-6 pt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Registrar para:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMember(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  m.id === selectedMemberId
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.name.split(' ')[0]} ({m.relationship})
              </button>
            ))}
          </div>
        </div>

        {/* Options Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onAction(opt.id);
                onClose();
              }}
              className={`p-3.5 rounded-xl border border-slate-200 text-left transition-all hover:shadow-xs cursor-pointer ${opt.color}`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                {opt.icon}
                <span className="text-xs font-bold text-slate-900">{opt.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {opt.description}
              </p>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
