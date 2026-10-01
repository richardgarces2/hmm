import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Phone,
  Printer,
  Heart,
  Activity,
  ShieldCheck,
  Stethoscope,
  Info,
} from 'lucide-react';
import {
  FamilyMember,
  AllergyCondition,
  Medication,
} from '../types/medical';
import { calculateAge, sanitizePhone, getBloodTypeBadgeClass } from '../utils/helpers';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  selectedMemberId: string;
  allergies: AllergyCondition[];
  medications: Medication[];
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  members,
  selectedMemberId,
  allergies,
  medications,
}) => {
  const [activeMemberId, setActiveMemberId] = useState(selectedMemberId);

  if (!isOpen) return null;

  const currentMember = members.find((m) => m.id === activeMemberId) || members[0];
  if (!currentMember) return null;

  const memberAllergies = allergies.filter((a) => a.memberId === currentMember.id);
  const severeAllergies = memberAllergies.filter((a) => a.severity === 'severe' || a.severity === 'moderate');
  const otherAllergies = memberAllergies.filter((a) => a.severity === 'mild');
  const activeMeds = medications.filter((m) => m.memberId === currentMember.id && m.status === 'active');
  const age = calculateAge(currentMember.birthDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
        
        {/* SOS Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Ficha Médica de Emergencia (SOS)
                </h2>
                <p className="text-xs text-red-100">
                  Información clínica crítica para primeros auxilios y personal sanitario
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handlePrint}
                className="p-2 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                title="Imprimir o Guardar en PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Member selector inside SOS */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar pb-1 no-print">
            {members.map((m) => {
              const isSelected = m.id === currentMember.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMemberId(m.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-red-700 shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  {m.name.split(' ')[0]} ({m.relationship})
                </button>
              );
            })}
          </div>
        </div>

        {/* SOS Body Card */}
        <div className="p-5 sm:p-6 space-y-5 bg-white text-slate-900">
          
          {/* Identity & Blood Group Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="sm:col-span-2 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Paciente / Familiar</div>
              <div className="text-xl font-bold text-slate-900">{currentMember.name}</div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <span>{currentMember.gender}</span>
                <span aria-hidden="true">·</span>
                <span>Nacimiento: {currentMember.birthDate}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums font-semibold">{age.label}</span>
              </div>
              <div className="text-xs text-slate-500 pt-1">
                <span className="font-medium text-slate-700">DNI/ID:</span> {currentMember.idNumber || 'No registrado'}
                <span className="mx-2">·</span>
                <span className="font-medium text-slate-700">Póliza:</span> {currentMember.insurancePolicy || 'Sin póliza'}
              </div>
            </div>

            {/* Blood type hero display */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-red-200 text-center">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Grupo Sanguíneo
              </span>
              <span className="text-3xl font-extrabold text-red-700 font-mono tracking-tight my-0.5">
                {currentMember.bloodType}
              </span>
              <span className="text-[10px] text-slate-500">
                {currentMember.isOrganDonor ? '✓ Donante de Órganos' : 'No donante'}
              </span>
            </div>
          </div>

          {/* CRITICAL ALERTS: Severe Allergies & Rescue Protocols */}
          <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 space-y-3">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>ALERGIAS SEVERAS Y RIESGOS CRÍTICOS</span>
            </div>

            {severeAllergies.length > 0 ? (
              <div className="space-y-2">
                {severeAllergies.map((allergy) => (
                  <div key={allergy.id} className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-700 text-sm">{allergy.name}</span>
                      <span className="text-[11px] font-bold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {allergy.severity === 'severe' ? 'Severa / Anafilaxis' : 'Moderada'}
                      </span>
                    </div>
                    {allergy.symptoms && (
                      <p className="text-xs text-slate-700 mt-1">
                        <strong className="text-slate-900">Síntomas:</strong> {allergy.symptoms}
                      </p>
                    )}
                    {allergy.rescueAction && (
                      <p className="text-xs text-red-900 font-medium mt-1 bg-red-50/70 p-2 rounded border border-red-100">
                        <strong>Acción de emergencia:</strong> {allergy.rescueAction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                ✓ No tiene alergias severas registradas en su expediente.
              </p>
            )}

            {currentMember.implantedDevices && currentMember.implantedDevices !== 'Ninguno' && (
              <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Dispositivos / Implantes:</strong> {currentMember.implantedDevices}
                </span>
              </div>
            )}
          </div>

          {/* Contacts: Emergency & Primary Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Emergency Contact */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>Contacto de Emergencia 1</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {currentMember.emergencyContact.name}
              </div>
              <div className="text-xs text-slate-500">
                Parentesco: {currentMember.emergencyContact.relationship}
              </div>
              <a
                href={`tel:${sanitizePhone(currentMember.emergencyContact.phone)}`}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Llamar: {currentMember.emergencyContact.phone}</span>
              </a>
            </div>

            {/* Primary Physician */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Médico de Cabecera</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {currentMember.primaryDoctor.name}
              </div>
              <div className="text-xs text-slate-500">
                {currentMember.primaryDoctor.specialty} · {currentMember.primaryDoctor.clinic}
              </div>
              <a
                href={`tel:${sanitizePhone(currentMember.primaryDoctor.phone)}`}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Llamar: {currentMember.primaryDoctor.phone}</span>
              </a>
            </div>

          </div>

          {/* Current Daily Essential Medications */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>Medicamentos Actuales ({activeMeds.length})</span>
            </div>

            {activeMeds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeMeds.map((med) => (
                  <div key={med.id} className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                    <div className="font-semibold text-slate-900">{med.name}</div>
                    <div className="text-slate-500">
                      {med.dosage} · {med.frequency}
                    </div>
                    {med.instructions && (
                      <div className="text-[11px] text-slate-600 italic mt-0.5">
                        {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No tiene medicamentos activos actualmente.</p>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Expediente SaludFamiliar · Actualizado 2026</span>
            <span className="font-mono">En caso de emergencia vital llame al 112 / 911</span>
          </div>

        </div>

      </div>
    </div>
  );
};
