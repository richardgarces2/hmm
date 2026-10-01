import React, { useState } from 'react';
import {
  Syringe,
  Plus,
  Trash2,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { VaccineRecord, FamilyMember } from '../types/medical';
import { formatDateSpanish } from '../utils/helpers';

interface VaccinesViewProps {
  member: FamilyMember;
  vaccines: VaccineRecord[];
  onAddVaccine: (vaccine: VaccineRecord) => void;
  onDeleteVaccine: (id: string) => void;
}

const COMMON_VACCINE_SUGGESTIONS = [
  'Hexavalente (DTPa-VPI-Hib-HB)',
  'Triple Viral (Sarampión, Rubeola, Paperas - SRP)',
  'Neumococo Conjugada (VNC13 / VNC15)',
  'Meningococo B / ACWY',
  'Virus del Papiloma Humano (VPH)',
  'Tétanos - Difteria - Tosferina (DTPa / Td)',
  'Influenza Estacional',
  'Hepatitis A / Hepatitis B',
  'Varicela',
  'COVID-19 Actualizada',
  'Fiebre Amarilla (Vacunación Internacional)',
];

export const VaccinesView: React.FC<VaccinesViewProps> = ({
  member,
  vaccines,
  onAddVaccine,
  onDeleteVaccine,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberVaccines = vaccines.filter((v) => v.memberId === member.id);

  const [formData, setFormData] = useState<VaccineRecord>({
    id: '',
    memberId: member.id,
    vaccineName: COMMON_VACCINE_SUGGESTIONS[0],
    dose: '1ª Dosis',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDoseDate: '',
    batchNumber: '',
    center: 'Centro de Salud',
    status: 'applied',
  });

  const handleOpenAdd = () => {
    setFormData({
      id: `vac_${Date.now()}`,
      memberId: member.id,
      vaccineName: COMMON_VACCINE_SUGGESTIONS[0],
      dose: '1ª Dosis',
      dateAdministered: new Date().toISOString().split('T')[0],
      nextDoseDate: '',
      batchNumber: '',
      center: 'Centro de Salud Local',
      status: 'applied',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vaccineName) return;
    onAddVaccine(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner & Quick Action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Carnet Digital de Inmunizaciones
              </h2>
              <p className="text-xs text-slate-500">
                Registro oficial de vacunas, dosis, número de lote y recordatorio de refuerzos
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Vacuna</span>
          </button>
        </div>
      </div>

      {/* Vaccines Grid */}
      {memberVaccines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memberVaccines.map((v) => {
            const hasBoosterSoon =
              v.nextDoseDate && new Date(v.nextDoseDate) >= new Date();

            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Syringe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {v.vaccineName}
                      </h3>
                      <div className="text-xs text-purple-800 font-semibold mt-0.5">
                        {v.dose}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${v.vaccineName}?`)) {
                        onDeleteVaccine(v.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar vacuna"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Administration Details */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fecha de Aplicación:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatDateSpanish(v.dateAdministered)}
                    </span>
                  </div>

                  {v.batchNumber && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Lote de fabricación:</span>
                      <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {v.batchNumber}
                      </span>
                    </div>
                  )}

                  {v.center && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Centro de Salud:</span>
                      </span>
                      <span className="text-slate-800 truncate max-w-[180px]">
                        {v.center}
                      </span>
                    </div>
                  )}
                </div>

                {/* Booster Alert status */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  {v.nextDoseDate ? (
                    <div className="flex items-center gap-1.5 text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>
                        Próximo refuerzo: <strong className="font-mono">{formatDateSpanish(v.nextDoseDate)}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium">Esquema completo / Dosis única</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Syringe className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Sin vacunas registradas</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Lleva al día el calendario de vacunación infantil y del adulto para proteger la salud familiar.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Primera Vacuna</span>
          </button>
        </div>
      )}

      {/* Modal: New Vaccine */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                Registrar Vacuna para {member.name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de la Vacuna / Inmunización *
                </label>
                <input
                  type="text"
                  required
                  list="vaccine-options"
                  placeholder="ej. Triple Viral (SRP) / Influenza / Hexavalente"
                  value={formData.vaccineName}
                  onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <datalist id="vaccine-options">
                  {COMMON_VACCINE_SUGGESTIONS.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dosis o Refuerzo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 1ª Dosis / Refuerzo 5 años"
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de Aplicación *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateAdministered}
                    onChange={(e) =>
                      setFormData({ ...formData, dateAdministered: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número de Lote (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="ej. LOTE-8942-A"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Próximo Refuerzo (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.nextDoseDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, nextDoseDate: e.target.value || null })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Centro de Salud / Hospital o Vacunatorio
                </label>
                <input
                  type="text"
                  placeholder="ej. Hospital Infantil Niño Jesús / Centro de Salud Norte"
                  value={formData.center}
                  onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Registro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
