export function calculateAge(birthDateString: string): { years: number; months: number; label: string } {
  const birth = new Date(birthDateString);
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  
  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    return { years, months, label: `${months} ${months === 1 ? 'mes' : 'meses'}` };
  }
  return { years, months, label: `${years} ${years === 1 ? 'año' : 'años'}` };
}

export function calculateBMI(weightKg: number, heightCm: number): {
  value: number;
  category: string;
  colorClass: string;
} {
  if (heightCm <= 0 || weightKg <= 0) {
    return { value: 0, category: 'Sin datos', colorClass: 'text-slate-500' };
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  if (rounded < 18.5) {
    return { value: rounded, category: 'Bajo peso', colorClass: 'text-amber-600' };
  } else if (rounded < 25.0) {
    return { value: rounded, category: 'Peso saludable (Normal)', colorClass: 'text-emerald-700' };
  } else if (rounded < 30.0) {
    return { value: rounded, category: 'Sobrepeso', colorClass: 'text-amber-700' };
  } else {
    return { value: rounded, category: 'Obesidad', colorClass: 'text-red-700' };
  }
}

export function formatDateSpanish(dateString: string): string {
  if (!dateString) return 'Sin fecha';
  try {
    const [year, month, day] = dateString.split('T')[0].split('-');
    if (!year || !month || !day) return dateString;
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    const monthName = months[parseInt(month, 10) - 1] || month;
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  } catch {
    return dateString;
  }
}

export function getBloodTypeBadgeClass(bloodType: string): string {
  switch (bloodType) {
    case 'O+':
    case 'O-':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'A+':
    case 'A-':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'B+':
    case 'B-':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'AB+':
    case 'AB-':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}
