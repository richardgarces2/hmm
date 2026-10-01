/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FamilyMember,
  MedicalConsultation,
  Medication,
  AllergyCondition,
  VaccineRecord,
  VitalSign,
  LabTest,
  ActiveTab,
} from './types/medical';
import {
  INITIAL_MEMBERS,
  INITIAL_CONSULTATIONS,
  INITIAL_MEDICATIONS,
  INITIAL_ALLERGIES_CONDITIONS,
  INITIAL_VACCINES,
  INITIAL_VITALS,
  INITIAL_LABS,
} from './data/initialData';
import { Header } from './components/Header';
import { FamilyMemberBar } from './components/FamilyMemberBar';
import { OverviewView } from './components/OverviewView';
import { ConsultationsView } from './components/ConsultationsView';
import { MedicationsView } from './components/MedicationsView';
import { VitalsView } from './components/VitalsView';
import { VaccinesView } from './components/VaccinesView';
import { AllergiesView } from './components/AllergiesView';
import { LabTestsView } from './components/LabTestsView';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { HealthAssistantModal } from './components/HealthAssistantModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BackupModal } from './components/BackupModal';
import { NewRecordModal } from './components/NewRecordModal';
import { Check, ShieldCheck, HeartPulse } from 'lucide-react';

const STORAGE_KEYS = {
  MEMBERS: 'saludfamiliar_members_v1',
  CONSULTATIONS: 'saludfamiliar_consultations_v1',
  MEDICATIONS: 'saludfamiliar_medications_v1',
  ALLERGIES: 'saludfamiliar_allergies_v1',
  VACCINES: 'saludfamiliar_vaccines_v1',
  VITALS: 'saludfamiliar_vitals_v1',
  LABS: 'saludfamiliar_labs_v1',
  SELECTED_MEMBER: 'saludfamiliar_selected_member_v1',
};

export default function App() {
  // Members
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_MEMBER);
    if (saved && members.some((m) => m.id === saved)) return saved;
    return members[0]?.id || 'm1';
  });

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Clinical records
  const [consultations, setConsultations] = useState<MedicalConsultation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  const [allergies, setAllergies] = useState<AllergyCondition[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALLERGIES);
    return saved ? JSON.parse(saved) : INITIAL_ALLERGIES_CONDITIONS;
  });

  const [vaccines, setVaccines] = useState<VaccineRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VACCINES);
    return saved ? JSON.parse(saved) : INITIAL_VACCINES;
  });

  const [vitals, setVitals] = useState<VitalSign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VITALS);
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [labs, setLabs] = useState<LabTest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LABS);
    return saved ? JSON.parse(saved) : INITIAL_LABS;
  });

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MEMBER, selectedMemberId);
  }, [selectedMemberId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALLERGIES, JSON.stringify(allergies));
  }, [allergies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(vaccines));
  }, [vaccines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
  }, [labs]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentMember =
    members.find((m) => m.id === selectedMemberId) || members[0] || INITIAL_MEMBERS[0];

  // Handlers for Member Management
  const handleSaveMember = (member: FamilyMember) => {
    if (members.some((m) => m.id === member.id)) {
      setMembers(members.map((m) => (m.id === member.id ? member : m)));
      showToast(`Perfil de ${member.name} actualizado`);
    } else {
      setMembers([...members, member]);
      setSelectedMemberId(member.id);
      showToast(`Familiar ${member.name} añadido correctamente`);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    const remaining = members.filter((m) => m.id !== memberId);
    if (remaining.length === 0) return;
    setMembers(remaining);
    setSelectedMemberId(remaining[0].id);
    showToast('Familiar eliminado');
  };

  // Handlers for Consultations
  const handleAddConsultation = (item: MedicalConsultation) => {
    setConsultations([item, ...consultations]);
    showToast('Consulta médica registrada con éxito');
  };

  const handleUpdateConsultation = (item: MedicalConsultation) => {
    setConsultations(consultations.map((c) => (c.id === item.id ? item : c)));
    showToast('Consulta médica actualizada');
  };

  const handleDeleteConsultation = (id: string) => {
    setConsultations(consultations.filter((c) => c.id !== id));
    showToast('Consulta eliminada');
  };

  // Handlers for Medications
  const handleAddMedication = (item: Medication) => {
    setMedications([item, ...medications]);
    showToast('Medicamento añadido al botiquín');
  };

  const handleUpdateMedication = (item: Medication) => {
    setMedications(medications.map((m) => (m.id === item.id ? item : m)));
    showToast('Medicamento actualizado');
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
    showToast('Medicamento eliminado');
  };

  const handleToggleMedTaken = (medId: string) => {
    setMedications(
      medications.map((m) => {
        if (m.id === medId) {
          const nextTaken = !m.takenToday;
          let remaining = m.remainingPills;
          if (nextTaken && remaining !== null && remaining > 0) {
            remaining -= 1;
          } else if (!nextTaken && remaining !== null) {
            remaining += 1;
          }
          return { ...m, takenToday: nextTaken, remainingPills: remaining };
        }
        return m;
      })
    );
  };

  // Handlers for Vitals
  const handleAddVital = (item: VitalSign) => {
    setVitals([item, ...vitals]);
    showToast('Signos vitales registrados');
  };

  const handleDeleteVital = (id: string) => {
    setVitals(vitals.filter((v) => v.id !== id));
    showToast('Registro de signos eliminado');
  };

  // Handlers for Vaccines
  const handleAddVaccine = (item: VaccineRecord) => {
    setVaccines([item, ...vaccines]);
    showToast('Vacuna añadida al carnet');
  };

  const handleDeleteVaccine = (id: string) => {
    setVaccines(vaccines.filter((v) => v.id !== id));
    showToast('Vacuna eliminada del carnet');
  };

  // Handlers for Allergies
  const handleAddAllergy = (item: AllergyCondition) => {
    setAllergies([item, ...allergies]);
    showToast('Alergia o condición registrada');
  };

  const handleDeleteAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id));
    showToast('Registro eliminado');
  };

  // Handlers for Labs
  const handleAddLab = (item: LabTest) => {
    setLabs([item, ...labs]);
    showToast('Estudio de laboratorio registrado');
  };

  const handleDeleteLab = (id: string) => {
    setLabs(labs.filter((l) => l.id !== id));
    showToast('Estudio eliminado');
  };

  // Handlers for Backup & Restore
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      members,
      consultations,
      medications,
      allergies,
      vaccines,
      vitals,
      labs,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaludFamiliar_CopiaSeguridad_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad descargada');
  };

  const handleImportBackup = (fileContent: string) => {
    try {
      const data = JSON.parse(fileContent);
      if (data.members && Array.isArray(data.members)) {
        setMembers(data.members);
        if (data.members[0]) setSelectedMemberId(data.members[0].id);
      }
      if (data.consultations && Array.isArray(data.consultations)) setConsultations(data.consultations);
      if (data.medications && Array.isArray(data.medications)) setMedications(data.medications);
      if (data.allergies && Array.isArray(data.allergies)) setAllergies(data.allergies);
      if (data.vaccines && Array.isArray(data.vaccines)) setVaccines(data.vaccines);
      if (data.vitals && Array.isArray(data.vitals)) setVitals(data.vitals);
      if (data.labs && Array.isArray(data.labs)) setLabs(data.labs);
      showToast('Copia de seguridad restaurada correctamente');
    } catch {
      alert('El archivo no tiene el formato JSON esperado para SaludFamiliar.');
    }
  };

  const handleResetToDefault = () => {
    setMembers(INITIAL_MEMBERS);
    setSelectedMemberId('m1');
    setConsultations(INITIAL_CONSULTATIONS);
    setMedications(INITIAL_MEDICATIONS);
    setAllergies(INITIAL_ALLERGIES_CONDITIONS);
    setVaccines(INITIAL_VACCINES);
    setVitals(INITIAL_VITALS);
    setLabs(INITIAL_LABS);
    showToast('Datos de demostración restablecidos');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* 1. Header (Top Bar Contract: 3 zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenNewRecord={() => setIsNewRecordOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* 2. Family Member Bar */}
      <FamilyMemberBar
        members={members}
        selectedMemberId={selectedMemberId}
        onSelectMember={(id) => setSelectedMemberId(id)}
        onAddMember={() => {
          setMemberToEdit(null);
          setIsProfileModalOpen(true);
        }}
        onEditMember={(m) => {
          setMemberToEdit(m);
          setIsProfileModalOpen(true);
        }}
        allergies={allergies}
      />

      {/* 3. Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            member={currentMember}
            consultations={consultations.filter((c) => c.memberId === currentMember.id)}
            medications={medications.filter((m) => m.memberId === currentMember.id)}
            allergies={allergies.filter((a) => a.memberId === currentMember.id)}
            vaccines={vaccines.filter((v) => v.memberId === currentMember.id)}
            vitals={vitals.filter((v) => v.memberId === currentMember.id)}
            labs={labs.filter((l) => l.memberId === currentMember.id)}
            setActiveTab={setActiveTab}
            onToggleMedTaken={handleToggleMedTaken}
            onOpenSOS={() => setIsSOSOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onNewConsultation={() => setActiveTab('consultations')}
            onNewVital={() => setActiveTab('vitals')}
          />
        )}

        {activeTab === 'consultations' && (
          <ConsultationsView
            member={currentMember}
            consultations={consultations}
            onAddConsultation={handleAddConsultation}
            onUpdateConsultation={handleUpdateConsultation}
            onDeleteConsultation={handleDeleteConsultation}
          />
        )}

        {activeTab === 'medications' && (
          <MedicationsView
            member={currentMember}
            medications={medications}
            onAddMedication={handleAddMedication}
            onUpdateMedication={handleUpdateMedication}
            onDeleteMedication={handleDeleteMedication}
            onToggleTaken={handleToggleMedTaken}
          />
        )}

        {activeTab === 'vitals' && (
          <VitalsView
            member={currentMember}
            vitals={vitals}
            onAddVital={handleAddVital}
            onDeleteVital={handleDeleteVital}
          />
        )}

        {activeTab === 'vaccines' && (
          <VaccinesView
            member={currentMember}
            vaccines={vaccines}
            onAddVaccine={handleAddVaccine}
            onDeleteVaccine={handleDeleteVaccine}
          />
        )}

        {activeTab === 'allergies' && (
          <AllergiesView
            member={currentMember}
            allergies={allergies}
            onAddAllergy={handleAddAllergy}
            onDeleteAllergy={handleDeleteAllergy}
          />
        )}

        {activeTab === 'labs' && (
          <LabTestsView
            member={currentMember}
            labs={labs}
            onAddLab={handleAddLab}
            onDeleteLab={handleDeleteLab}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800">SaludFamiliar</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Historial Clínico Seguro y Confidencial</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>{members.length} familiares registrados</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:text-slate-900 cursor-pointer underline-offset-2 hover:underline"
            >
              Exportar datos
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="hover:text-slate-900 cursor-pointer underline-offset-2 hover:underline"
            >
              Guía médica
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        members={members}
        selectedMemberId={selectedMemberId}
        allergies={allergies}
        medications={medications}
      />

      <MemberProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        memberToEdit={memberToEdit}
        onSave={handleSaveMember}
        onDelete={handleDeleteMember}
        isOnlyMember={members.length <= 1}
      />

      <HealthAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        member={currentMember}
        consultations={consultations}
        medications={medications}
        allergies={allergies}
        vitals={vitals}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        members={members}
        consultations={consultations}
        medications={medications}
        allergies={allergies}
        vaccines={vaccines}
        labs={labs}
        onNavigate={(memberId, tab) => {
          setSelectedMemberId(memberId);
          setActiveTab(tab);
        }}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onExport={handleExportBackup}
        onImport={handleImportBackup}
        onResetToDefault={handleResetToDefault}
      />

      <NewRecordModal
        isOpen={isNewRecordOpen}
        onClose={() => setIsNewRecordOpen(false)}
        members={members}
        selectedMemberId={selectedMemberId}
        onSelectMember={(id) => setSelectedMemberId(id)}
        onAction={(tab) => setActiveTab(tab)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in border border-slate-700">
          <Check className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
