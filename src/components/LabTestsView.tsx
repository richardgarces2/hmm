import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
  Microscope,
} from 'lucide-react';
import { LabTest, FamilyMember } from '../types/medical';
import { formatDateSpanish } from '../utils/helpers';

interface LabTestsViewProps {
  member: FamilyMember;
  labs: LabTest[];
  onAddLab: (lab: LabTest) => void;
  onDeleteLab: (id: string) => void;
}

export const LabTestsView: React.FC<LabTestsViewProps> = ({
  member,
  labs,
  onAddLab,
  onDeleteLab,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberLabs = labs.filter((l) => l.memberId === member.id);

  const [formData, setFormData] = useState<LabTest>({
    id: '',
    memberId: member.id,
    testName: '',
    date: new Date().toISOString().split('T')[0],
    laboratory: '',
    resultSummary: '',
    status: 'normal',
    fileAttachmentName: null,
    notes: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      id: `lab_${Date.now()}`,
      memberId: member.id,
      testName: 'Analítica Sanguínea General',
      date: new Date().toISOString().split('T')[0],
      laboratory: 'Laboratorio Clínico Sanitas',
      resultSummary: '',
      status: 'normal',
      fileAttachmentName: `Informe_${member.name.split(' ')[0]}_${new Date().getFullYear()}.pdf`,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.testName) return;
    onAddLab(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner & Action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Microscope className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Laboratorios, Analíticas e Informes Diagnósticos
              </h2>
              <p className="text-xs text-slate-500">
                Historial de análisis clínicos de sangre, orina, radiología y biopsias
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Estudio</span>
          </button>
        </div>
      </div>

      {/* Lab List */}
      {memberLabs.length > 0 ? (
        <div className="space-y-4">
          {memberLabs.map((lab) => {
            const isCritical = lab.status === 'critical';
            const isAttention = lab.status === 'attention';

            return (
              <div
                key={lab.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-red-50 text-red-700'
                          : isAttention
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{lab.testName}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lab.laboratory}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateSpanish(lab.date)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : isAttention
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isCritical
                        ? 'Valores Críticos / Alerta'
                        : isAttention
                        ? 'Requiere Atención'
                        : 'Valores en Rango Normal'}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${lab.testName}?`)) {
                          onDeleteLab(lab.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Eliminar estudio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Summary Values */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    Hallazgos y Resultados Clínicos:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-mono">
                    {lab.resultSummary}
                  </p>
                </div>

                {/* File Attachment & Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 gap-2">
                  {lab.notes ? (
                    <span className="text-slate-500 italic">
                      <strong>Observación:</strong> {lab.notes}
                    </span>
                  ) : <div />}

                  {lab.fileAttachmentName && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer shrink-0">
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono text-[11px] font-medium">
                        {lab.fileAttachmentName}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Microscope className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Sin estudios registrados</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Guarda los resultados de laboratorio para compararlos y tenerlos a mano en cualquier consulta.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Primer Estudio</span>
          </button>
        </div>
      )}

      {/* Modal: New Lab Test */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                Registrar Estudio para {member.name}
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
                  Nombre del Estudio / Examen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Hemograma Completo / Perfil Lipídico / Ecografía Abdominal"
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de Realización *
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
                    Estado de Resultados
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'normal' | 'attention' | 'critical',
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="normal">Valores Normales</option>
                    <option value="attention">Requiere Atención / Fuera de Rango</option>
                    <option value="critical">Crítico / Alerta Clínica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Laboratorio o Centro Radiológico
                </label>
                <input
                  type="text"
                  placeholder="ej. Laboratorios Megalab / Diagnóstico Quirón"
                  value={formData.laboratory}
                  onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resumen de Valores y Conclusión *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="ej. Colesterol Total: 195 mg/dL. Glucosa: 92 mg/dL. Hemoglobina: 14.2 g/dL. Parámetros normales..."
                  value={formData.resultSummary}
                  onChange={(e) => setFormData({ ...formData, resultSummary: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de Archivo Digital / PDF Asociado (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Informe_Analitica_Septiembre_2026.pdf"
                  value={formData.fileAttachmentName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fileAttachmentName: e.target.value || null })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Indicación o Comentarios Médicos
                </label>
                <input
                  type="text"
                  placeholder="ej. Control anual preventivo solicitado por médico de cabecera..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  <span>Guardar Estudio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
