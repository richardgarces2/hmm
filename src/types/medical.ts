export type Kinship =
  | 'Padre'
  | 'Madre'
  | 'Hijo'
  | 'Hija'
  | 'Abuelo'
  | 'Abuela'
  | 'Tío'
  | 'Tía'
  | 'Hermano'
  | 'Hermana'
  | 'Otro';

export type BloodType =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'Desconocido';

export interface DoctorContact {
  name: string;
  specialty: string;
  phone: string;
  clinic: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Kinship;
  birthDate: string; // YYYY-MM-DD
  gender: 'Masculino' | 'Femenino' | 'Otro';
  bloodType: BloodType;
  idNumber: string; // DNI, Cédula, Pasaporte
  insuranceName: string; // Seguro médico / EPS / Obra Social
  insurancePolicy: string;
  primaryDoctor: DoctorContact;
  emergencyContact: EmergencyContact;
  isOrganDonor: boolean;
  implantedDevices: string; // Marcapasos, prótesis, etc.
  notes: string;
  color: string;
}

export interface MedicalConsultation {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  doctorName: string;
  specialty: string;
  clinic: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  nextFollowUp: string | null;
  notes: string;
}

export interface Medication {
  id: string;
  memberId: string;
  name: string;
  dosage: string; // ej. 500 mg
  frequency: string; // ej. Cada 8 horas
  startDate: string;
  endDate: string | null;
  status: 'active' | 'completed' | 'paused';
  instructions: string;
  prescribedBy: string;
  dailyDoseTimes: string[]; // ej. ["08:00", "16:00", "00:00"]
  takenToday: boolean;
  remainingPills: number | null;
}

export interface AllergyCondition {
  id: string;
  memberId: string;
  type: 'allergy' | 'chronic_condition';
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedYear: string;
  symptoms: string;
  rescueAction: string; // qué hacer en caso de emergencia
}

export interface VaccineRecord {
  id: string;
  memberId: string;
  vaccineName: string;
  dose: string;
  dateAdministered: string;
  nextDoseDate: string | null;
  batchNumber: string;
  center: string;
  status: 'applied' | 'pending' | 'overdue';
}

export interface VitalSign {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD HH:mm
  systolic: number | null; // mmHg
  diastolic: number | null; // mmHg
  heartRate: number | null; // lpm
  glucose: number | null; // mg/dL
  temperature: number | null; // °C
  spo2: number | null; // %
  weightKg: number | null;
  heightCm: number | null;
  bmi: number | null;
  notes: string;
}

export interface LabTest {
  id: string;
  memberId: string;
  testName: string;
  date: string;
  laboratory: string;
  resultSummary: string;
  status: 'normal' | 'attention' | 'critical';
  fileAttachmentName: string | null;
  notes: string;
}

export type ActiveTab =
  | 'overview'
  | 'consultations'
  | 'medications'
  | 'vitals'
  | 'vaccines'
  | 'allergies'
  | 'labs';
