import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RotateCcw,
  MinusCircle,
  PlusCircle,
} from 'lucide-react';
import { Medication, FamilyMember } from '../types/medical';
import { formatDateSpanish } from '../utils/helpers';

interface MedicationsViewProps {
  member: FamilyMember;
  medications: Medication[];
  onAddMedication: (med: Medication) => void;
  onUpdateMedication: (med: Medication) => void;
  onDeleteMedication: (id: string) => void;
  onToggleTaken: (id: string) => void;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  member,
  medications,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onToggleTaken,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const memberMeds = medications.filter((m) => m.memberId === member.id);

  const filteredMeds = memberMeds.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const [formData, setFormData] = useState<Medication>({
    id: '',
    memberId: member.id,
    name: '',
    dosage: '',
    frequency: 'Una vez al día',
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    status: 'active',
    instructions: '',
    prescribedBy: '',
    dailyDoseTimes: ['08:00'],
    takenToday: false,
    remainingPills: null,
  });

  const handleOpenAdd = () => {
    setEditingMed(null);
    setFormData({
      id: `med_${Date.now()}`,
      memberId: member.id,
      name: '',
      dosage: '500 mg',
      frequency: 'Cada 8 horas',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      status: 'active',
      instructions: 'Tomar después de las comidas',
      prescribedBy: member.primaryDoctor.name || '',
      dailyDoseTimes: ['08:00', '16:00', '00:00'],
      takenToday: false,
      remainingPills: 30,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med: Medication) => {
    setEditingMed(med);
    setFormData(med);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    if (editingMed) {
      onUpdateMedication(formData);
    } else {
      onAddMedication(formData);
    }
    setIsModalOpen(false);
  };

  const handleAdjustPills = (med: Medication, delta: number) => {
    if (med.remainingPills === null) return;
    const newCount = Math.max(0, med.remainingPills + delta);
    onUpdateMedication({ ...med, remainingPills: newCount });
  };

  return (
    <div className="space-y-5">
      
      {/* Top Filter & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Segmented status filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'active'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Activos ({memberMeds.filter((m) => m.status === 'active').length})
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({memberMeds.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completados ({memberMeds.filter((m) => m.status === 'completed').length})
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Medicamento</span>
          </button>
        </div>
      </div>

      {/* Medications Grid / Cards */}
      {filteredMeds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeds.map((med) => {
            const isLowStock = med.remainingPills !== null && med.remainingPills <= 5;

            return (
              <div
                key={med.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all space-y-3.5 ${
                  med.status === 'active'
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 opacity-75 bg-slate-50/50'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        med.status === 'active'
                          ? 'bg-teal-50 text-teal-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {med.name}
                      </h3>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {med.dosage} · {med.frequency}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(med)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Editar medicamento"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${med.name}?`)) {
                          onDeleteMedication(med.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar medicamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                {med.instructions && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900">Indicación:</strong> {med.instructions}
                  </div>
                )}

                {/* Dose Schedule Times */}
                {med.dailyDoseTimes && med.dailyDoseTimes.length > 0 && (
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">Horarios:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      {med.dailyDoseTimes.map((time, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-700"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock tracker and Check button */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  
                  {/* Remaining pills tracker */}
                  {med.remainingPills !== null ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Restan:</span>
                      <span
                        className={`font-mono font-bold tabular-nums px-2 py-0.5 rounded ${
                          isLowStock
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {med.remainingPills} dosis
                      </span>
                      {isLowStock && (
                        <span className="text-amber-600" title="Pocas dosis disponibles">
                          <AlertCircle className="w-3.5 h-3.5" />
                        </span>
                      )}

                      <div className="flex items-center gap-0.5 ml-1">
                        <button
                          onClick={() => handleAdjustPills(med, -1)}
                          className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                          title="Restar 1 toma"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjustPills(med, 10)}
                          className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                          title="Reponer frasco (+10)"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Sin control de inventario</span>
                  )}

                  {/* Toggle taken button */}
                  {med.status === 'active' && (
                    <button
                      onClick={() => onToggleTaken(med.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        med.takenToday
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{med.takenToday ? 'Tomada hoy ✓' : 'Marcar toma hoy'}</span>
                    </button>
                  )}
                </div>

                {/* Footer metadata: Prescribed by & Dates */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Recetado por: {med.prescribedBy || 'Médico tratante'}</span>
                  <span>Desde: {formatDateSpanish(med.startDate)}</span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Pill className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">No hay medicamentos en esta sección</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Registra los tratamientos farmacológicos actuales o pasados para no olvidar tomas y controlar recetas.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Añadir Medicamento</span>
          </button>
        </div>
      )}

      {/* Modal: New / Edit Medication */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {editingMed ? 'Editar Medicamento' : `Nuevo Medicamento para ${member.name}`}
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
                  Nombre del Fármaco / Medicamento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Losartán Potásico / Paracetamol"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dosis o Concentración *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 500 mg / 10 ml"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Frecuencia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Cada 8 horas"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instrucciones Especiales de Administración
                </label>
                <input
                  type="text"
                  placeholder="ej. Tomar con el desayuno y abundante agua, no partir el comprimido..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de Finalización (Opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value || null })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado del Tratamiento
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'completed' | 'paused',
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="active">Activo (en curso)</option>
                    <option value="paused">En pausa</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pastillas / Dosis Restantes
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="ej. 30"
                    value={formData.remainingPills !== null ? formData.remainingPills : ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        remainingPills: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Médico que Prescribió
                </label>
                <input
                  type="text"
                  placeholder="ej. Dr. Roberto Mendoza"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
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
                  <span>{editingMed ? 'Guardar Cambios' : 'Añadir Medicamento'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
