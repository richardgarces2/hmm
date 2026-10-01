import React from 'react';
import {
  AlertTriangle,
  Pill,
  HeartPulse,
  Calendar,
  Syringe,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Plus,
  Stethoscope,
  Activity,
  Flame,
} from 'lucide-react';
import {
  FamilyMember,
  MedicalConsultation,
  Medication,
  AllergyCondition,
  VaccineRecord,
  VitalSign,
  LabTest,
  ActiveTab,
} from '../types/medical';
import {
  calculateAge,
  calculateBMI,
  formatDateSpanish,
  getBloodTypeBadgeClass,
} from '../utils/helpers';

interface OverviewViewProps {
  member: FamilyMember;
  consultations: MedicalConsultation[];
  medications: Medication[];
  allergies: AllergyCondition[];
  vaccines: VaccineRecord[];
  vitals: VitalSign[];
  labs: LabTest[];
  setActiveTab: (tab: ActiveTab) => void;
  onToggleMedTaken: (medId: string) => void;
  onOpenSOS: () => void;
  onOpenAssistant: () => void;
  onNewConsultation: () => void;
  onNewVital: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  member,
  consultations,
  medications,
  allergies,
  vaccines,
  vitals,
  labs,
  setActiveTab,
  onToggleMedTaken,
  onOpenSOS,
  onOpenAssistant,
  onNewConsultation,
  onNewVital,
}) => {
  const age = calculateAge(member.birthDate);
  const severeAlerts = allergies.filter(
    (a) => a.severity === 'severe' || a.severity === 'moderate'
  );
  const activeMeds = medications.filter((m) => m.status === 'active');
  const latestVital = vitals.length > 0 ? vitals[0] : null;
  const bmiInfo = latestVital && latestVital.weightKg && latestVital.heightCm
    ? calculateBMI(latestVital.weightKg, latestVital.heightCm)
    : null;

  // Upcoming consultations or vaccines
  const upcomingVisits = consultations.filter((c) => c.nextFollowUp);
  const pendingVaccines = vaccines.filter(
    (v) => v.status === 'pending' || (v.nextDoseDate && new Date(v.nextDoseDate) >= new Date())
  );

  return (
    <div className="space-y-6">
      
      {/* Member Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-xs"
              style={{ backgroundColor: member.color || '#0d9488' }}
            >
              {member.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {member.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border ${getBloodTypeBadgeClass(member.bloodType)}`}>
                  {member.bloodType}
                </span>
              </div>

              {/* Zero-Pill metadata with separators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{member.relationship}</span>
                <span aria-hidden="true">·</span>
                <span>{member.gender}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums font-semibold">{age.label}</span>
                <span aria-hidden="true">·</span>
                <span>Nacimiento: {formatDateSpanish(member.birthDate)}</span>
                {member.idNumber && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">ID: {member.idNumber}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick shortcuts */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSOS}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Ver Ficha SOS</span>
            </button>
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
              <span>Preparar Consulta</span>
            </button>
          </div>
        </div>

        {/* Member notes or alerts */}
        {member.notes && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Observaciones médicas:</span> {member.notes}
          </div>
        )}
      </div>

      {/* CRITICAL ALERTS BANNER (If severe allergies or conditions exist) */}
      {severeAlerts.length > 0 && (
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-red-900 tracking-tight">
                  Alertas Críticas y Protocolos de Rescate
                </h3>
                <button
                  onClick={() => setActiveTab('allergies')}
                  className="text-xs font-semibold text-red-700 hover:text-red-900 underline cursor-pointer"
                >
                  Ver detalle
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {severeAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-white rounded-xl border border-red-200 text-xs shadow-2xs">
                    <div className="flex items-center justify-between font-bold text-red-800">
                      <span>{alert.name}</span>
                      <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                        {alert.severity === 'severe' ? 'Anafilaxis / Severa' : 'Moderada'}
                      </span>
                    </div>
                    {alert.rescueAction && (
                      <p className="text-[11px] text-slate-700 mt-1.5 bg-red-50/50 p-1.5 rounded">
                        <strong>Protocolo:</strong> {alert.rescueAction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Daily Medications Checklist & Latest Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Medications Checklist (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Medicamentos Activos y Control de Hoy
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('medications')}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Gestionar todos ({activeMeds.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeMeds.length > 0 ? (
            <div className="space-y-3 flex-1">
              {activeMeds.map((med) => (
                <div
                  key={med.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    med.takenToday
                      ? 'bg-slate-50 border-slate-200 text-slate-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${med.takenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {med.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {med.dosage}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{med.frequency}</span>
                      </span>
                      {med.instructions && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[280px]">{med.instructions}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {med.remainingPills !== null && (
                      <span className="text-[11px] font-mono tabular-nums text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {med.remainingPills} dosis rest.
                      </span>
                    )}
                    <button
                      onClick={() => onToggleMedTaken(med.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        med.takenToday
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{med.takenToday ? 'Tomada hoy ✓' : 'Marcar toma'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <Pill className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">No hay medicamentos activos registrados para este familiar.</p>
              <button
                onClick={() => setActiveTab('medications')}
                className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
              >
                + Añadir Medicamento
              </button>
            </div>
          )}
        </div>

        {/* Latest Vitals Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Últimos Signos Vitales
              </h2>
            </div>
            <button
              onClick={onNewVital}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar</span>
            </button>
          </div>

          {latestVital ? (
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* Blood Pressure */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Presión Arterial</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {latestVital.systolic && latestVital.diastolic
                      ? `${latestVital.systolic}/${latestVital.diastolic}`
                      : '—'}
                    <span className="text-[11px] font-sans font-normal text-slate-500 ml-1">mmHg</span>
                  </div>
                </div>

                {/* Heart Rate */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Frecuencia Cardíaca</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {latestVital.heartRate || '—'}
                    <span className="text-[11px] font-sans font-normal text-slate-500 ml-1">ppm</span>
                  </div>
                </div>

                {/* Glucose */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Glucosa Basal</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {latestVital.glucose || '—'}
                    <span className="text-[11px] font-sans font-normal text-slate-500 ml-1">mg/dL</span>
                  </div>
                </div>

                {/* SpO2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Oxígeno (SpO2)</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {latestVital.spo2 ? `${latestVital.spo2}%` : '—'}
                  </div>
                </div>
              </div>

              {/* Weight & BMI summary */}
              {latestVital.weightKg && latestVital.heightCm && bmiInfo && (
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>
                      Peso: <strong className="font-mono tabular-nums">{latestVital.weightKg} kg</strong> · Talla: <strong className="font-mono tabular-nums">{latestVital.heightCm} cm</strong>
                    </span>
                    <span className="font-mono tabular-nums font-bold text-teal-900">
                      IMC: {bmiInfo.value}
                    </span>
                  </div>
                  <div className="text-[11px] mt-1 font-semibold">
                    Estado nutricional: <span className={bmiInfo.colorClass}>{bmiInfo.category}</span>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Registrado: {latestVital.date}</span>
                <button
                  onClick={() => setActiveTab('vitals')}
                  className="text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
                >
                  Ver gráficas →
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400">
              <HeartPulse className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">No hay signos vitales registrados.</p>
              <button
                onClick={onNewVital}
                className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
              >
                + Registrar primer control
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Row: Recent Consultations & Upcoming Medical Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Consultations Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Últimas Consultas Médicas
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('consultations')}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas ({consultations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {consultations.length > 0 ? (
            <div className="space-y-3">
              {consultations.slice(0, 2).map((consultation) => (
                <div
                  key={consultation.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {consultation.specialty}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDateSpanish(consultation.date)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">{consultation.doctorName}</span> · {consultation.clinic}
                  </div>
                  <div className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <strong className="text-slate-900">Diagnóstico:</strong> {consultation.diagnosis}
                  </div>
                  {consultation.treatment && (
                    <div className="text-xs text-slate-600 mt-1 pl-1 line-clamp-1">
                      <strong className="text-slate-800">Plan:</strong> {consultation.treatment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No hay consultas registradas para este familiar.
            </p>
          )}
        </div>

        {/* Vaccines & Scheduled Boosters Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Syringe className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Vacunas y Próximos Refuerzos
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('vaccines')}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver carnet ({vaccines.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {vaccines.length > 0 ? (
            <div className="space-y-2.5">
              {vaccines.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">
                      {v.vaccineName}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{v.dose}</span>
                      <span aria-hidden="true">·</span>
                      <span>Aplicada: {formatDateSpanish(v.dateAdministered)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {v.nextDoseDate ? (
                      <span className="text-[11px] font-mono text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Próx: {formatDateSpanish(v.nextDoseDate)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Esquema al día
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No hay vacunas registradas en el carnet.
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
