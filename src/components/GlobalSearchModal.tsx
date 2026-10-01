import React, { useState } from 'react';
import {
  Search,
  X,
  User,
  Pill,
  Calendar,
  AlertTriangle,
  Syringe,
  Microscope,
  ArrowRight,
} from 'lucide-react';
import {
  FamilyMember,
  MedicalConsultation,
  Medication,
  AllergyCondition,
  VaccineRecord,
  LabTest,
  ActiveTab,
} from '../types/medical';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  consultations: MedicalConsultation[];
  medications: Medication[];
  allergies: AllergyCondition[];
  vaccines: VaccineRecord[];
  labs: LabTest[];
  onNavigate: (memberId: string, tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  members,
  consultations,
  medications,
  allergies,
  vaccines,
  labs,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || 'Familiar';

  const results: {
    type: 'med' | 'consultation' | 'allergy' | 'vaccine' | 'lab';
    title: string;
    subtitle: string;
    memberId: string;
    tab: ActiveTab;
  }[] = [];

  if (q.length >= 2) {
    // Meds
    medications.forEach((m) => {
      if (
        m.name.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        m.instructions.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'med',
          title: m.name,
          subtitle: `Medicamento: ${m.dosage} · ${m.frequency} (${getMemberName(m.memberId)})`,
          memberId: m.memberId,
          tab: 'medications',
        });
      }
    });

    // Consultations
    consultations.forEach((c) => {
      if (
        c.diagnosis.toLowerCase().includes(q) ||
        c.reason.toLowerCase().includes(q) ||
        c.doctorName.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'consultation',
          title: `${c.specialty}: ${c.diagnosis}`,
          subtitle: `Dr. ${c.doctorName} · ${c.date} (${getMemberName(c.memberId)})`,
          memberId: c.memberId,
          tab: 'consultations',
        });
      }
    });

    // Allergies
    allergies.forEach((a) => {
      if (
        a.name.toLowerCase().includes(q) ||
        a.symptoms.toLowerCase().includes(q) ||
        a.rescueAction.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'allergy',
          title: `Alergia/Riesgo: ${a.name}`,
          subtitle: `Severidad: ${a.severity.toUpperCase()} (${getMemberName(a.memberId)})`,
          memberId: a.memberId,
          tab: 'allergies',
        });
      }
    });

    // Vaccines
    vaccines.forEach((v) => {
      if (
        v.vaccineName.toLowerCase().includes(q) ||
        v.dose.toLowerCase().includes(q) ||
        (v.batchNumber && v.batchNumber.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'vaccine',
          title: `Vacuna: ${v.vaccineName}`,
          subtitle: `${v.dose} · Aplicada: ${v.dateAdministered} (${getMemberName(v.memberId)})`,
          memberId: v.memberId,
          tab: 'vaccines',
        });
      }
    });

    // Labs
    labs.forEach((l) => {
      if (
        l.testName.toLowerCase().includes(q) ||
        l.resultSummary.toLowerCase().includes(q) ||
        l.laboratory.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'lab',
          title: `Estudio: ${l.testName}`,
          subtitle: `${l.laboratory} · ${l.date} (${getMemberName(l.memberId)})`,
          memberId: l.memberId,
          tab: 'labs',
        });
      }
    });
  }

  const handleSelect = (memberId: string, tab: ActiveTab) => {
    onNavigate(memberId, tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar por fármaco, síntoma, médico, vacuna, analítica..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          {q.length < 2 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Escribe al menos 2 letras para buscar en todo el historial familiar.
            </div>
          ) : results.length > 0 ? (
            results.map((res, index) => (
              <button
                key={index}
                onClick={() => handleSelect(res.memberId, res.tab)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-100/80 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-200/70 text-slate-700 flex items-center justify-center shrink-0">
                    {res.type === 'med' && <Pill className="w-4 h-4 text-teal-600" />}
                    {res.type === 'consultation' && <Calendar className="w-4 h-4 text-blue-600" />}
                    {res.type === 'allergy' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    {res.type === 'vaccine' && <Syringe className="w-4 h-4 text-purple-600" />}
                    {res.type === 'lab' && <Microscope className="w-4 h-4 text-emerald-600" />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {res.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {res.subtitle}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No se encontraron coincidencias para &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
