import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Trash2,
  ShieldAlert,
  HeartCrack,
  Activity,
  X,
  Save,
  LifeBuoy,
} from 'lucide-react';
import { AllergyCondition, FamilyMember } from '../types/medical';

interface AllergiesViewProps {
  member: FamilyMember;
  allergies: AllergyCondition[];
  onAddAllergy: (item: AllergyCondition) => void;
  onDeleteAllergy: (id: string) => void;
}

export const AllergiesView: React.FC<AllergiesViewProps> = ({
  member,
  allergies,
  onAddAllergy,
  onDeleteAllergy,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'allergy' | 'chronic_condition'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberItems = allergies.filter((a) => a.memberId === member.id);

  const filteredItems = memberItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const [formData, setFormData] = useState<AllergyCondition>({
    id: '',
    memberId: member.id,
    type: 'allergy',
    name: '',
    severity: 'moderate',
    diagnosedYear: '2024',
    symptoms: '',
    rescueAction: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      id: `ac_${Date.now()}`,
      memberId: member.id,
      type: 'allergy',
      name: '',
      severity: 'moderate',
      diagnosedYear: new Date().getFullYear().toString(),
      symptoms: '',
      rescueAction: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddAllergy(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Alergias y Condiciones Médicas Crónicas
              </h2>
              <p className="text-xs text-slate-500">
                Protocolos de emergencia, síntomas desencadenantes y advertencias sanitarias
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Alergia / Condición</span>
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 pt-3 mt-3">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({memberItems.length})
          </button>
          <button
            onClick={() => setFilterType('allergy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'allergy'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Alergias ({memberItems.filter((i) => i.type === 'allergy').length})
          </button>
          <button
            onClick={() => setFilterType('chronic_condition')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'chronic_condition'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Condiciones Crónicas ({memberItems.filter((i) => i.type === 'chronic_condition').length})
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isSevere = item.severity === 'severe';
            const isModerate = item.severity === 'moderate';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all space-y-3 ${
                  isSevere
                    ? 'border-red-300 ring-1 ring-red-200'
                    : isModerate
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSevere
                          ? 'bg-red-100 text-red-700'
                          : isModerate
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.type === 'allergy' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Activity className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isSevere
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : isModerate
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isSevere ? 'Severa / Anafilaxis' : isModerate ? 'Moderada' : 'Leve'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.type === 'allergy' ? 'Alergia diagnosticada' : 'Patología crónica'} · Año {item.diagnosedYear}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${item.name}?`)) {
                        onDeleteAllergy(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Symptoms */}
                {item.symptoms && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 block mb-0.5">Manifestaciones y Síntomas:</strong>
                    <span>{item.symptoms}</span>
                  </div>
                )}

                {/* Rescue Action */}
                {item.rescueAction ? (
                  <div
                    className={`text-xs p-3 rounded-xl border space-y-1 ${
                      isSevere
                        ? 'bg-red-50 text-red-950 border-red-200'
                        : 'bg-amber-50/70 text-amber-950 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-[11px]">
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>Protocolo de Acción Inmediata:</span>
                    </div>
                    <p className="leading-relaxed font-medium">{item.rescueAction}</p>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    Sin protocolo específico registrado.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">No hay alergias ni condiciones crónicas</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Registra cualquier intolerancia a medicamentos, alimentos o patologías para proteger al paciente en urgencias.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Registro</span>
          </button>
        </div>
      )}

      {/* Modal: New Allergy or Chronic Condition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                Añadir Alergia o Condición Crónica ({member.name})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Registro *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'allergy' | 'chronic_condition',
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="allergy">Alergia / Intolerancia</option>
                    <option value="chronic_condition">Condición / Patología Crónica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gravedad / Severidad *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        severity: e.target.value as 'mild' | 'moderate' | 'severe',
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="mild">Leve</option>
                    <option value="moderate">Moderada</option>
                    <option value="severe">Severa / Riesgo Anafilaxis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de la Alergia o Enfermedad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Penicilina / Cacahuates / Asma Bronquial / Diabetes Tipo 1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Año de Diagnóstico
                </label>
                <input
                  type="text"
                  placeholder="ej. 2022"
                  value={formData.diagnosedYear}
                  onChange={(e) => setFormData({ ...formData, diagnosedYear: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Síntomas y Manifestaciones Clínicas
                </label>
                <textarea
                  rows={2}
                  placeholder="ej. Urticaria con picazón, hinchazón facial, dificultad para respirar..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-red-800">
                  Acción de Rescate / Protocolo de Emergencia
                </label>
                <textarea
                  rows={3}
                  placeholder="ej. Inyectar autoinyector de adrenalina Epipen en cara lateral del muslo y trasladar a urgencias inmediatamente..."
                  value={formData.rescueAction}
                  onChange={(e) => setFormData({ ...formData, rescueAction: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-red-50/30"
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
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
