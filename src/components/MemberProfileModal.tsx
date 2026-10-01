import React, { useState, useEffect } from 'react';
import { X, Trash2, Save, User, Shield, Stethoscope, Phone } from 'lucide-react';
import { FamilyMember, Kinship, BloodType } from '../types/medical';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit: FamilyMember | null; // null if creating a new member
  onSave: (member: FamilyMember) => void;
  onDelete?: (id: string) => void;
  isOnlyMember?: boolean;
}

const KINSHIP_OPTIONS: Kinship[] = [
  'Padre',
  'Madre',
  'Hijo',
  'Hija',
  'Abuelo',
  'Abuela',
  'Tío',
  'Tía',
  'Hermano',
  'Hermana',
  'Otro',
];

const BLOOD_TYPES: BloodType[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Desconocido',
];

const COLOR_PALETTE = [
  '#0d9488', // teal
  '#0284c7', // sky
  '#7c3aed', // violet
  '#ea580c', // orange
  '#16a34a', // emerald
  '#db2777', // pink
  '#4f46e5', // indigo
  '#d97706', // amber
];

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
  onSave,
  onDelete,
  isOnlyMember,
}) => {
  const [formData, setFormData] = useState<FamilyMember>({
    id: '',
    name: '',
    relationship: 'Hijo',
    birthDate: '2020-01-01',
    gender: 'Masculino',
    bloodType: 'O+',
    idNumber: '',
    insuranceName: '',
    insurancePolicy: '',
    primaryDoctor: {
      name: '',
      specialty: 'Medicina General',
      phone: '',
      clinic: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    isOrganDonor: false,
    implantedDevices: 'Ninguno',
    notes: '',
    color: '#0d9488',
  });

  useEffect(() => {
    if (memberToEdit) {
      setFormData(memberToEdit);
    } else {
      setFormData({
        id: `m_${Date.now()}`,
        name: '',
        relationship: 'Hijo',
        birthDate: '2015-05-15',
        gender: 'Masculino',
        bloodType: 'O+',
        idNumber: '',
        insuranceName: 'Seguro Médico Familiar',
        insurancePolicy: '',
        primaryDoctor: {
          name: '',
          specialty: 'Pediatría',
          phone: '',
          clinic: '',
        },
        emergencyContact: {
          name: '',
          relationship: 'Madre',
          phone: '',
        },
        isOrganDonor: false,
        implantedDevices: 'Ninguno',
        notes: '',
        color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
      });
    }
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {memberToEdit ? 'Editar Perfil del Familiar' : 'Añadir Nuevo Familiar'}
            </h2>
            <p className="text-xs text-slate-500">
              Datos personales, médicos y contactos de emergencia
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>1. Datos Personales Básicos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Sofía Morales Gómez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parentesco / Rol en la familia *
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value as Kinship })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {KINSHIP_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sexo Biológico
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as 'Masculino' | 'Femenino' | 'Otro',
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grupo Sanguíneo y Factor Rh
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodType: e.target.value as BloodType })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white font-mono"
                >
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documento de Identidad (DNI/Cédula)
                </label>
                <input
                  type="text"
                  placeholder="ej. 54.218.092"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Color del Perfil
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        formData.color === c ? 'scale-115 border-slate-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Seguro Médico */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Cobertura Médica y Dispositivos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seguro Médico / EPS / Obra Social
                </label>
                <input
                  type="text"
                  placeholder="ej. Sanitas / Adeslas / EPS Sura"
                  value={formData.insuranceName}
                  onChange={(e) => setFormData({ ...formData, insuranceName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de Afiliación / Póliza
                </label>
                <input
                  type="text"
                  placeholder="ej. SAN-8834921-C"
                  value={formData.insurancePolicy}
                  onChange={(e) => setFormData({ ...formData, insurancePolicy: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dispositivos Médicos o Implantes (Marcapasos, Ortodoncia, Prótesis, etc.)
                </label>
                <input
                  type="text"
                  placeholder="ej. Ninguno / Ortodoncia brackets / Marcapasos bicameral"
                  value={formData.implantedDevices}
                  onChange={(e) => setFormData({ ...formData, implantedDevices: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="organDonor"
                  checked={formData.isOrganDonor}
                  onChange={(e) => setFormData({ ...formData, isOrganDonor: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="organDonor" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Manifiesta voluntad expresa de ser donante de órganos y tejidos
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Contactos de Emergencia y Médico de Cabecera */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>3. Contactos Clave y Médico Tratante</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contacto de Emergencia
                </label>
                <input
                  type="text"
                  placeholder="ej. Elena Gómez"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parentesco del Contacto
                </label>
                <input
                  type="text"
                  placeholder="ej. Madre / Cónyuge"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact,
                        relationship: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  placeholder="ej. +34 612 345 678"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Médico de Cabecera
                </label>
                <input
                  type="text"
                  placeholder="ej. Dra. Lucía Valenzuela"
                  value={formData.primaryDoctor.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryDoctor: { ...formData.primaryDoctor, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Especialidad y Clínica
                </label>
                <input
                  type="text"
                  placeholder="ej. Pediatría · Hosp. Niño Jesús"
                  value={formData.primaryDoctor.specialty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryDoctor: { ...formData.primaryDoctor, specialty: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teléfono del Consultorio
                </label>
                <input
                  type="tel"
                  placeholder="ej. +34 615 771 900"
                  value={formData.primaryDoctor.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryDoctor: { ...formData.primaryDoctor, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Notas adicionales */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observaciones Clínicas Relevantes
            </label>
            <textarea
              rows={2}
              placeholder="Anotaciones generales sobre estilo de vida, recomendaciones pediátricas o antecedentes familiares..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {memberToEdit && onDelete && !isOnlyMember ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar el perfil de ${memberToEdit.name}?`)) {
                    onDelete(memberToEdit.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar miembro</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{memberToEdit ? 'Guardar Cambios' : 'Añadir Familiar'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
