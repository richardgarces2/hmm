import React from 'react';
import {
  UserPlus,
  Edit2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { FamilyMember, AllergyCondition } from '../types/medical';
import { calculateAge, getBloodTypeBadgeClass } from '../utils/helpers';

interface FamilyMemberBarProps {
  members: FamilyMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
  onAddMember: () => void;
  onEditMember: (member: FamilyMember) => void;
  allergies: AllergyCondition[];
}

export const FamilyMemberBar: React.FC<FamilyMemberBarProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  onAddMember,
  onEditMember,
  allergies,
}) => {
  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const getMemberAlertCount = (memberId: string) => {
    return allergies.filter(
      (a) => a.memberId === memberId && (a.severity === 'severe' || a.severity === 'moderate')
    ).length;
  };

  return (
    <div className="no-print bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Member selector cards/tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
              Familia:
            </span>
            {members.map((member) => {
              const isSelected = member.id === selectedMemberId;
              const age = calculateAge(member.birthDate);
              const severeAlertCount = getMemberAlertCount(member.id);

              return (
                <button
                  key={member.id}
                  onClick={() => onSelectMember(member.id)}
                  className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Avatar with initials and kinship color */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs"
                    style={{ backgroundColor: member.color || '#0d9488' }}
                  >
                    {member.name.charAt(0)}
                  </div>

                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-semibold truncate ${
                          isSelected ? 'text-teal-950 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {member.name.split(' ')[0]}
                      </span>
                      {severeAlertCount > 0 && (
                        <span title="Alerta de salud o alergia severa" className="text-red-500">
                          <AlertCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    {/* Clean unboxed metadata with separators */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>{member.relationship}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{age.label}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Add member button */}
            <button
              onClick={onAddMember}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 text-slate-600 hover:text-teal-800 text-xs font-medium transition-colors shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Familiar</span>
            </button>
          </div>

          {/* Current member quick profile pill/actions */}
          {currentMember && (
            <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-medium text-slate-900">{currentMember.name}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${getBloodTypeBadgeClass(currentMember.bloodType)}`}>
                  {currentMember.bloodType}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500 truncate max-w-[140px] sm:max-w-[200px]" title={currentMember.insuranceName}>
                  {currentMember.insuranceName}
                </span>
              </div>

              <button
                onClick={() => onEditMember(currentMember)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Editar datos del familiar"
              >
                <Edit2 className="w-3 h-3 text-slate-500" />
                <span>Editar perfil</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
