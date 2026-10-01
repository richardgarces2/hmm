import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  FileText,
  Copy,
  Check,
  Calculator,
  BookOpen,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  FamilyMember,
  MedicalConsultation,
  Medication,
  AllergyCondition,
  VitalSign,
} from '../types/medical';
import { calculateAge, calculateBMI, formatDateSpanish } from '../utils/helpers';

interface HealthAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  consultations: MedicalConsultation[];
  medications: Medication[];
  allergies: AllergyCondition[];
  vitals: VitalSign[];
}

const MEDICAL_TERMS_DICTIONARY = [
  {
    term: 'Hemoglobina (Hb)',
    category: 'Hematología',
    meaning: 'Proteína en los glóbulos rojos que transporta el oxígeno a todos los tejidos del cuerpo.',
    reference: 'Mujeres: 12.0 - 15.5 g/dL · Hombres: 13.5 - 17.5 g/dL · Niños: 11.5 - 14.5 g/dL',
    interpretation: 'Valores bajos suelen indicar anemia (por deficiencia de hierro u otras causas). Valores elevados pueden deberse a deshidratación o hipoxemia.',
  },
  {
    term: 'Leucocitos (Glóbulos Blancos)',
    category: 'Inmunología',
    meaning: 'Células principales del sistema inmunitario encargadas de combatir bacterias, virus y parásitos.',
    reference: '4.500 - 11.000 /µL (en adultos)',
    interpretation: 'Elevados (leucocitosis) frecuentemente indican infección activa, estrés o inflamación. Disminuidos (leucopenia) pueden reflejar infecciones virales o efectos medicamentosos.',
  },
  {
    term: 'TSH (Hormona Tiroestimulante)',
    category: 'Endocrinología',
    meaning: 'Hormona producida por la hipófisis que regula el funcionamiento de la glándula tiroides.',
    reference: '0.4 - 4.0 mUI/L',
    interpretation: 'Si está alta, la tiroides trabaja de forma lenta (hipotiroidismo). Si está muy baja, la tiroides está hiperactiva (hipertiroidismo).',
  },
  {
    term: 'Creatinina Sérica',
    category: 'Función Renal',
    meaning: 'Producto de desecho del metabolismo muscular filtrado casi en su totalidad por los riñones.',
    reference: '0.6 - 1.2 mg/dL',
    interpretation: 'Permite estimar la tasa de filtrado glomerular. Si se eleva, indica que los riñones no están filtrando a su capacidad habitual.',
  },
  {
    term: 'Colesterol LDL ("Malo")',
    category: 'Cardiovascular',
    meaning: 'Lipoproteína de baja densidad que transporta colesterol y puede acumularse en las arterias.',
    reference: 'Deseable: < 100 mg/dL (o < 70 mg/dL en pacientes con riesgo cardiovascular)',
    interpretation: 'Valores elevados predisponen a aterosclerosis y requieren ajuste en dieta, ejercicio y a veces fármacos como estatinas.',
  },
  {
    term: 'Ferritina',
    category: 'Metabolismo del Hierro',
    meaning: 'Proteína celular que almacena hierro y lo libera de manera controlada.',
    reference: 'Mujeres: 20 - 200 ng/mL · Hombres: 30 - 300 ng/mL',
    interpretation: 'Es el mejor indicador de las reservas corporales de hierro. Valores bajos confirman ferropenia antes de que aparezca anemia visible.',
  },
];

export const HealthAssistantModal: React.FC<HealthAssistantModalProps> = ({
  isOpen,
  onClose,
  member,
  consultations,
  medications,
  allergies,
  vitals,
}) => {
  const [activeTool, setActiveTool] = useState<'briefing' | 'calculator' | 'dictionary'>('briefing');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pediatric dose calculator state
  const [childWeight, setChildWeight] = useState<number>(
    member.relationship === 'Hijo' || member.relationship === 'Hija'
      ? vitals.find((v) => v.memberId === member.id && v.weightKg)?.weightKg || 18
      : 18
  );
  const [selectedDrug, setSelectedDrug] = useState<'paracetamol' | 'ibuprofeno'>('paracetamol');

  if (!isOpen) return null;

  const age = calculateAge(member.birthDate);
  const memberMeds = medications.filter((m) => m.memberId === member.id && m.status === 'active');
  const memberAllergies = allergies.filter((a) => a.memberId === member.id);
  const memberVitals = vitals.filter((v) => v.memberId === member.id);
  const latestVital = memberVitals.length > 0 ? memberVitals[0] : null;

  // Medical briefing text generation
  const briefingText = `EXPEDIENTE MÉDICO PREVIO A LA CONSULTA
Paciente: ${member.name}
Parentesco: ${member.relationship} | Sexo: ${member.gender} | Edad: ${age.label} (Nacimiento: ${member.birthDate})
Grupo Sanguíneo: ${member.bloodType} | DNI: ${member.idNumber || 'N/A'}
Seguro / Póliza: ${member.insuranceName || 'N/A'} (${member.insurancePolicy || 'N/A'})

ALERGIAS Y RIESGOS CLÍNICOS:
${
  memberAllergies.length > 0
    ? memberAllergies
        .map(
          (a) =>
            `- ${a.name} [Severidad: ${a.severity.toUpperCase()}] ${
              a.rescueAction ? `| Protocolo: ${a.rescueAction}` : ''
            }`
        )
        .join('\n')
    : 'Sin alergias conocidas registradas.'
}

MEDICACIÓN ACTIVA ACTUAL:
${
  memberMeds.length > 0
    ? memberMeds
        .map((m) => `- ${m.name} (${m.dosage}) | Pauta: ${m.frequency} | Indicación: ${m.instructions}`)
        .join('\n')
    : 'No toma medicamentos crónicos actualmente.'
}

ÚLTIMOS SIGNOS VITALES REGISTRADOS (${latestVital?.date || 'Sin datos'}):
- Tensión arterial: ${
    latestVital?.systolic && latestVital?.diastolic
      ? `${latestVital.systolic}/${latestVital.diastolic} mmHg`
      : 'N/D'
  }
- Frecuencia cardíaca: ${latestVital?.heartRate ? `${latestVital.heartRate} lpm` : 'N/D'}
- Glucemia: ${latestVital?.glucose ? `${latestVital.glucose} mg/dL` : 'N/D'}
- Sat. Oxígeno (SpO2): ${latestVital?.spo2 ? `${latestVital.spo2}%` : 'N/D'}
- Peso y Talla: ${latestVital?.weightKg || 'N/D'} kg / ${latestVital?.heightCm || 'N/D'} cm ${
    latestVital?.bmi ? `(IMC: ${latestVital.bmi})` : ''
  }

DISPOSITIVOS MÉDICOS O ANTECEDENTES:
- ${member.implantedDevices || 'Ninguno'}
- Observaciones: ${member.notes || 'Ninguna'}
`;

  const handleCopyBriefing = () => {
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Pediatric calculator formulas:
  // Paracetamol: 10 - 15 mg/kg per dose, every 6-8h. (Max 60 mg/kg/day)
  // Standard syrup 120mg / 5ml (24 mg/ml) or drops 100mg/ml
  // Ibuprofeno: 5 - 10 mg/kg per dose, every 8h. (Max 30-40 mg/kg/day)
  // Standard syrup 20mg / ml (100mg / 5ml) or 40mg / ml (200mg / 5ml)
  const paracetamolDoseMg = Math.round(childWeight * 12.5); // mid 12.5 mg/kg
  const paracetamolMl120 = Math.round(((childWeight * 12.5) / 24) * 10) / 10; // 120mg/5ml = 24mg/ml
  const paracetamolMl100 = Math.round(((childWeight * 12.5) / 100) * 10) / 10; // 100mg/ml drops

  const ibuprofenoDoseMg = Math.round(childWeight * 7.5); // mid 7.5 mg/kg
  const ibuprofenoMl100 = Math.round(((childWeight * 7.5) / 20) * 10) / 10; // 100mg/5ml = 20mg/ml
  const ibuprofenoMl200 = Math.round(((childWeight * 7.5) / 40) * 10) / 10; // 200mg/5ml = 40mg/ml

  const filteredDictionary = MEDICAL_TERMS_DICTIONARY.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Guía Médica y Herramientas Clínicas
              </h2>
              <p className="text-xs text-slate-500">
                Preparador de consultas, explicador de analíticas y cálculo de dosis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTool('briefing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTool === 'briefing'
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resumen para el Médico</span>
          </button>

          <button
            onClick={() => setActiveTool('calculator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTool === 'calculator'
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculadora Dosis Infantil</span>
          </button>

          <button
            onClick={() => setActiveTool('dictionary')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTool === 'dictionary'
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explicador de Laboratorio</span>
          </button>
        </div>

        {/* Tab 1: Briefing */}
        {activeTool === 'briefing' && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hoja de Resumen Clínico para Consulta
                </h3>
                <p className="text-xs text-slate-500">
                  Documento organizado para entregar a su médico de cabecera o especialista
                </p>
              </div>

              <button
                onClick={handleCopyBriefing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-teal-700">
              {briefingText}
            </pre>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
              <Stethoscope className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong>Consejo útil:</strong> Lleva este resumen a la consulta para no olvidar detallar medicamentos actuales, alergias y controles tensionales al profesional sanitario.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Pediatric Dose Calculator */}
        {activeTool === 'calculator' && (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Calculadora Antipirética Pediátrica por Peso
                </h3>
                <p className="text-xs text-slate-500">
                  Cálculo educativo de dosificación pediátrica para Paracetamol e Ibuprofeno
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Aviso de seguridad médica:</strong> Esta herramienta es una referencia informativa. Confirme siempre la dosis exacta con su pediatra o en el prospecto del fabricante. No administre ibuprofeno a menores de 3 meses ni en caso de deshidratación.
              </span>
            </div>

            {/* Inputs: Weight & Drug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peso del niño/a (kg):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="3"
                    max="50"
                    step="0.5"
                    value={childWeight}
                    onChange={(e) => setChildWeight(parseFloat(e.target.value))}
                    className="flex-1 accent-teal-600"
                  />
                  <input
                    type="number"
                    min="3"
                    max="60"
                    step="0.5"
                    value={childWeight}
                    onChange={(e) => setChildWeight(parseFloat(e.target.value) || 10)}
                    className="w-20 px-2 py-1 text-sm font-mono border border-slate-300 rounded-lg text-center"
                  />
                  <span className="text-xs font-semibold text-slate-600">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Principio Activo:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDrug('paracetamol')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selectedDrug === 'paracetamol'
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Paracetamol
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDrug('ibuprofeno')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selectedDrug === 'ibuprofeno'
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Ibuprofeno
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {selectedDrug === 'paracetamol' ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-900">
                    Paracetamol (Dosis por toma: 10 - 15 mg/kg)
                  </span>
                  <span className="text-xs text-teal-800 font-mono font-bold bg-teal-50 px-2.5 py-1 rounded">
                    ~ {paracetamolDoseMg} mg por toma
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium block">
                      Jarabe común (120 mg / 5 ml o 24 mg/ml):
                    </span>
                    <span className="text-xl font-bold text-slate-900 font-mono block mt-1">
                      {paracetamolMl120} ml
                    </span>
                    <span className="text-[11px] text-slate-400">Cada 6 a 8 horas (máx. 4 tomas/día)</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium block">
                      Gotas pediátricas (100 mg / ml):
                    </span>
                    <span className="text-xl font-bold text-slate-900 font-mono block mt-1">
                      {paracetamolMl100} ml
                    </span>
                    <span className="text-[11px] text-slate-400">Equivale a aprox. {Math.round(paracetamolMl100 * 25)} gotas</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-900">
                    Ibuprofeno (Dosis por toma: 5 - 10 mg/kg)
                  </span>
                  <span className="text-xs text-teal-800 font-mono font-bold bg-teal-50 px-2.5 py-1 rounded">
                    ~ {ibuprofenoDoseMg} mg por toma
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium block">
                      Jarabe al 2% (100 mg / 5 ml o 20 mg/ml):
                    </span>
                    <span className="text-xl font-bold text-slate-900 font-mono block mt-1">
                      {ibuprofenoMl100} ml
                    </span>
                    <span className="text-[11px] text-slate-400">Cada 8 horas con alimentos</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium block">
                      Jarabe al 4% (200 mg / 5 ml o 40 mg/ml):
                    </span>
                    <span className="text-xl font-bold text-slate-900 font-mono block mt-1">
                      {ibuprofenoMl200} ml
                    </span>
                    <span className="text-[11px] text-slate-400">Formulación concentrada</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Lab Dictionary */}
        {activeTool === 'dictionary' && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Glosario de Análisis Clínicos y Valores de Referencia
              </h3>
              <p className="text-xs text-slate-500">
                Explicaciones claras en lenguaje sencillo sobre los análisis médicos más comunes
              </p>
            </div>

            <input
              type="text"
              placeholder="Buscar término (ej. TSH, ferritina, hemoglobina, creatinina)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
            />

            <div className="space-y-3">
              {filteredDictionary.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{item.term}</span>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-700">{item.meaning}</p>
                  <div className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded border border-slate-200">
                    <strong>Rangos de referencia habituales:</strong> {item.reference}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <strong>Significado clínico:</strong> {item.interpretation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
