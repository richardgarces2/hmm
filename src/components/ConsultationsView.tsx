import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Plus,
  Trash2,
  Edit3,
  Stethoscope,
  Building2,
  Clock,
  FileCheck,
  X,
  Save,
} from 'lucide-react';
import { MedicalConsultation, FamilyMember } from '../types/medical';
import { formatDateSpanish } from '../utils/helpers';

interface ConsultationsViewProps {
  member: FamilyMember;
  consultations: MedicalConsultation[];
  onAddConsultation: (consultation: MedicalConsultation) => void;
  onUpdateConsultation: (consultation: MedicalConsultation) => void;
  onDeleteConsultation: (id: string) => void;
}

export const ConsultationsView: React.FC<ConsultationsViewProps> = ({
  member,
  consultations,
  onAddConsultation,
  onUpdateConsultation,
  onDeleteConsultation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<MedicalConsultation | null>(null);

  // Form state
  const [formData, setFormData] = useState<MedicalConsultation>({
    id: '',
    memberId: member.id,
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
    specialty: 'Medicina General',
    clinic: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    nextFollowUp: '',
    notes: '',
  });

  const memberConsultations = consultations.filter((c) => c.memberId === member.id);

  // Extract unique specialties for filtering
  const specialties = Array.from(
    new Set(memberConsultations.map((c) => c.specialty.split('/')[0].trim()))
  );

  const filtered = memberConsultations.filter((c) => {
    const matchesSearch =
      c.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clinic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'all' || c.specialty.includes(selectedSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  const handleOpenAdd = () => {
    setEditingConsultation(null);
    setFormData({
      id: `c_${Date.now()}`,
      memberId: member.id,
      date: new Date().toISOString().split('T')[0],
      doctorName: member.primaryDoctor.name || '',
      specialty: member.primaryDoctor.specialty || 'Medicina General',
      clinic: member.primaryDoctor.clinic || '',
      reason: '',
      diagnosis: '',
      treatment: '',
      nextFollowUp: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MedicalConsultation) => {
    setEditingConsultation(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.diagnosis) return;
    if (editingConsultation) {
      onUpdateConsultation(formData);
    } else {
      onAddConsultation(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Top action & filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por médico, diagnóstico, síntoma o clínica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
            />
          </div>

          {/* Specialty filter buttons / tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedSpecialty('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
                selectedSpecialty === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({memberConsultations.length})
            </button>
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
                  selectedSpecialty === spec
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Consulta</span>
          </button>
        </div>
      </div>

      {/* Consultations List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header: Specialty & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {consultation.specialty}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span>{consultation.doctorName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{consultation.clinic}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateSpanish(consultation.date)}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(consultation)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Editar consulta"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este registro de consulta?')) {
                          onDeleteConsultation(consultation.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar consulta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Diagnosis & Reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {consultation.reason && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Motivo de consulta / Síntomas:</span>
                    <span className="text-slate-600">{consultation.reason}</span>
                  </div>
                )}

                <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100">
                  <span className="font-bold text-teal-900 block mb-0.5">Diagnóstico Clínico:</span>
                  <span className="text-slate-800">{consultation.diagnosis}</span>
                </div>
              </div>

              {/* Prescribed Treatment */}
              {consultation.treatment && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs">
                  <span className="font-bold text-slate-900 block mb-1">Tratamiento y Recomendaciones Prescritas:</span>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {consultation.treatment}
                  </p>
                </div>
              )}

              {/* Clinical Notes & Next Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-1 gap-2">
                {consultation.notes ? (
                  <div className="italic text-slate-600 line-clamp-2">
                    <span className="font-semibold not-italic text-slate-700">Notas adicionales:</span> {consultation.notes}
                  </div>
                ) : <div />}

                {consultation.nextFollowUp && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 font-semibold rounded-lg border border-amber-200 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Próximo control: {formatDateSpanish(consultation.nextFollowUp)}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">No se encontraron consultas</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No hay registros que coincidan con el término de búsqueda.'
              : 'Añade la primera consulta médica de este familiar para llevar un control detallado de diagnósticos y tratamientos.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Consulta</span>
          </button>
        </div>
      )}

      {/* Modal: New / Edit Consultation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {editingConsultation ? 'Editar Consulta Médica' : `Nueva Consulta para ${member.name}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de la Consulta *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Especialidad Médica *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Pediatría / Cardiología / Medicina General"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre del Médico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Dra. Lucía Valenzuela"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clínica u Hospital
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Centro Médico Metropolitano"
                    value={formData.clinic}
                    onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivo de Consulta y Síntomas
                </label>
                <input
                  type="text"
                  placeholder="ej. Fiebre de 38.5°C por 2 días y dolor de garganta al tragar..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnóstico Clínico *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="ej. Faringoamigdalitis aguda viral..."
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tratamiento y Plan de Cuidados
                </label>
                <textarea
                  rows={3}
                  placeholder="ej. Paracetamol 500mg cada 8 horas por 3 días si hay dolor. Abundantes líquidos. Reposo..."
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Próximo Control / Cita de Seguimiento (Opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.nextFollowUp || ''}
                    onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notas u Observaciones
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Se solicitó analítica de sangre para la próxima semana..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
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
                  <span>{editingConsultation ? 'Guardar Cambios' : 'Guardar Consulta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
