import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  Trash2,
  TrendingUp,
  Activity,
  Flame,
  Scale,
  X,
  Save,
  Info,
} from 'lucide-react';
import { VitalSign, FamilyMember } from '../types/medical';
import { calculateBMI, formatDateSpanish } from '../utils/helpers';

interface VitalsViewProps {
  member: FamilyMember;
  vitals: VitalSign[];
  onAddVital: (vital: VitalSign) => void;
  onDeleteVital: (id: string) => void;
}

export const VitalsView: React.FC<VitalsViewProps> = ({
  member,
  vitals,
  onAddVital,
  onDeleteVital,
}) => {
  const [activeChartMetric, setActiveChartMetric] = useState<
    'bloodPressure' | 'heartRate' | 'glucose' | 'weight' | 'spo2'
  >('bloodPressure');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberVitals = vitals
    .filter((v) => v.memberId === member.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Quick form state for new record
  const [formData, setFormData] = useState<VitalSign>({
    id: '',
    memberId: member.id,
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    glucose: 95,
    temperature: 36.5,
    spo2: 98,
    weightKg: 70,
    heightCm: 170,
    bmi: 24.2,
    notes: '',
  });

  const handleOpenAdd = () => {
    // autofill previous height if exists
    const lastHeight = memberVitals.find((v) => v.heightCm)?.heightCm || 170;
    const lastWeight = memberVitals.find((v) => v.weightKg)?.weightKg || 70;
    const initialBmi = calculateBMI(lastWeight, lastHeight).value;

    setFormData({
      id: `vit_${Date.now()}`,
      memberId: member.id,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      glucose: 95,
      temperature: 36.5,
      spo2: 98,
      weightKg: lastWeight,
      heightCm: lastHeight,
      bmi: initialBmi,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleWeightHeightChange = (weight: number | null, height: number | null) => {
    let bmiValue: number | null = null;
    if (weight && height) {
      bmiValue = calculateBMI(weight, height).value;
    }
    setFormData({
      ...formData,
      weightKg: weight,
      heightCm: height,
      bmi: bmiValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVital(formData);
    setIsModalOpen(false);
  };

  // Prepare chronological data for SVG sparkline/chart (oldest to newest)
  const chartData = [...memberVitals].reverse();

  return (
    <div className="space-y-5">
      
      {/* Top Banner & Metric Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Evolución y Control de Signos Vitales
            </h2>
            <p className="text-xs text-slate-500">
              Monitoreo continuo de tensión arterial, glucosa, frecuencia cardíaca y antropometría
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Signos Vitales</span>
          </button>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
          {[
            { id: 'bloodPressure', label: 'Presión Arterial (mmHg)' },
            { id: 'heartRate', label: 'Frecuencia Cardíaca (lpm)' },
            { id: 'glucose', label: 'Glucosa (mg/dL)' },
            { id: 'weight', label: 'Peso (kg) e IMC' },
            { id: 'spo2', label: 'Saturación SpO2 (%)' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveChartMetric(m.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeChartMetric === m.id
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Dynamic SVG Visual Chart */}
        <div className="pt-2">
          {chartData.length >= 2 ? (
            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">
                  Histórico de mediciones ({chartData.length} registros)
                </span>
                <span className="text-[11px] font-mono">
                  {chartData[0].date.split(' ')[0]} → {chartData[chartData.length - 1].date.split(' ')[0]}
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-44 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />

                  {/* Render based on selected metric */}
                  {activeChartMetric === 'bloodPressure' && (() => {
                    const points = chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 480 + 10;
                      // map systolic 90-160 to height
                      const sys = d.systolic || 120;
                      const ySys = 110 - ((sys - 80) / (160 - 80)) * 90;
                      const dia = d.diastolic || 80;
                      const yDia = 110 - ((dia - 50) / (110 - 50)) * 70;
                      return { x, ySys, yDia, sys, dia, date: d.date.split(' ')[0] };
                    });

                    const pathSys = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.ySys}`).join(' ');
                    const pathDia = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yDia}`).join(' ');

                    return (
                      <g>
                        <path d={pathSys} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
                        <path d={pathDia} fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.ySys} r="3.5" fill="#0d9488" />
                            <text x={p.x} y={p.ySys - 7} fontSize="8" fill="#0f766e" textAnchor="middle" className="font-mono font-bold">
                              {p.sys}
                            </text>
                            <circle cx={p.x} cy={p.yDia} r="3" fill="#0284c7" />
                            <text x={p.x} y={p.yDia + 12} fontSize="8" fill="#0369a1" textAnchor="middle" className="font-mono">
                              {p.dia}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}

                  {activeChartMetric !== 'bloodPressure' && (() => {
                    const values = chartData.map((d) => {
                      if (activeChartMetric === 'heartRate') return d.heartRate || 72;
                      if (activeChartMetric === 'glucose') return d.glucose || 90;
                      if (activeChartMetric === 'weight') return d.weightKg || 70;
                      return d.spo2 || 98;
                    });
                    const min = Math.min(...values) * 0.95;
                    const max = Math.max(...values) * 1.05;
                    const range = max - min || 1;

                    const points = values.map((val, i) => {
                      const x = (i / (values.length - 1)) * 480 + 10;
                      const y = 105 - ((val - min) / range) * 85;
                      return { x, y, val };
                    });

                    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                    return (
                      <g>
                        <path d={path} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="3.5" fill="#0d9488" />
                            <text x={p.x} y={p.y - 7} fontSize="8" fill="#0f766e" textAnchor="middle" className="font-mono font-bold">
                              {p.val}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {activeChartMetric === 'bloodPressure' && (
                <div className="flex items-center justify-center gap-6 text-[11px] text-slate-600 mt-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-teal-600" />
                    <span>Sistólica (ideal: &lt;120 mmHg)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-sky-600 border-dashed" />
                    <span>Diastólica (ideal: &lt;80 mmHg)</span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
              Se requieren al menos 2 registros para desplegar la gráfica de tendencia en el tiempo.
            </div>
          )}
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Registro Histórico de Medidas ({memberVitals.length})
          </h3>
        </div>

        {memberVitals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-3">Presión (mmHg)</th>
                  <th className="py-3 px-3">Frecuencia (lpm)</th>
                  <th className="py-3 px-3">Glucosa (mg/dL)</th>
                  <th className="py-3 px-3">SpO2 (%)</th>
                  <th className="py-3 px-3">Temp (°C)</th>
                  <th className="py-3 px-3">Peso / Talla / IMC</th>
                  <th className="py-3 px-3">Notas</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberVitals.map((v) => {
                  const bmi = v.weightKg && v.heightCm ? calculateBMI(v.weightKg, v.heightCm) : null;
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                        {v.date}
                      </td>
                      <td className="py-3.5 px-3 font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                        {v.systolic && v.diastolic ? `${v.systolic}/${v.diastolic}` : '—'}
                      </td>
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-800">
                        {v.heartRate || '—'}
                      </td>
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-800">
                        {v.glucose ? `${v.glucose}` : '—'}
                      </td>
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-800">
                        {v.spo2 ? `${v.spo2}%` : '—'}
                      </td>
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-800">
                        {v.temperature ? `${v.temperature}°C` : '—'}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {v.weightKg ? (
                          <div>
                            <span className="font-mono tabular-nums font-semibold text-slate-900">
                              {v.weightKg} kg
                            </span>{' '}
                            {v.heightCm && (
                              <span className="text-slate-400 font-mono">/ {v.heightCm} cm</span>
                            )}
                            {bmi && (
                              <span className={`block text-[11px] font-semibold ${bmi.colorClass}`}>
                                IMC {bmi.value} ({bmi.category})
                              </span>
                            )}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-[200px] truncate" title={v.notes}>
                        {v.notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este registro de signos vitales?')) {
                              onDeleteVital(v.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400">
            <HeartPulse className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-xs">No hay signos vitales registrados todavía para este miembro.</p>
          </div>
        )}
      </div>

      {/* Modal: New Vital Sign Measurement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                Registrar Signos Vitales para {member.name}
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
                  Fecha y Hora de la Medición
                </label>
                <input
                  type="text"
                  required
                  placeholder="AAAA-MM-DD HH:mm"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              {/* Blood Pressure Pair */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sistólica (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 120"
                    value={formData.systolic || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        systolic: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diastólica (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 80"
                    value={formData.diastolic || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diastolic: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Heart rate & SpO2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Frecuencia Cardíaca (lpm)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 72"
                    value={formData.heartRate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heartRate: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Oxígeno SpO2 (%)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 98"
                    value={formData.spo2 || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        spo2: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Glucose & Temp */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Glucosa Basal (mg/dL)
                  </label>
                  <input
                    type="number"
                    placeholder="ej. 92"
                    value={formData.glucose || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        glucose: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Temperatura (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="ej. 36.5"
                    value={formData.temperature || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        temperature: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Weight & Height with auto BMI */}
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Peso Corporal (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="ej. 75.5"
                      value={formData.weightKg || ''}
                      onChange={(e) =>
                        handleWeightHeightChange(
                          e.target.value ? parseFloat(e.target.value) : null,
                          formData.heightCm
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estatura / Talla (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="ej. 175"
                      value={formData.heightCm || ''}
                      onChange={(e) =>
                        handleWeightHeightChange(
                          formData.weightKg,
                          e.target.value ? parseInt(e.target.value, 10) : null
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono bg-white"
                    />
                  </div>
                </div>

                {formData.bmi && (
                  <div className="text-xs text-teal-900 flex items-center justify-between pt-1">
                    <span>
                      IMC Calculado: <strong className="font-mono text-sm">{formData.bmi}</strong>
                    </span>
                    <span className="font-semibold">
                      {calculateBMI(formData.weightKg || 0, formData.heightCm || 0).category}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas u Observaciones del Momento
                </label>
                <input
                  type="text"
                  placeholder="ej. Medición en reposo de 5 minutos, antes del desayuno..."
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
                  <span>Guardar Medición</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
