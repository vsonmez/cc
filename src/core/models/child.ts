export interface Child {
  id: string;
  name: string;
  grade: number;
  createdAt: number;
}

export function createChild(childName: string, childGrade: number): Child {
  return {
    id: crypto.randomUUID(),
    name: childName.trim(),
    grade: childGrade,
    createdAt: Date.now()
  };
}

export function isValidChildName(childName: string): boolean {
  const trimmedName = childName.trim();
  return trimmedName.length > 0 && trimmedName.length <= 50;
}

export function isValidGrade(childGrade: number): boolean {
  return Number.isInteger(childGrade) && childGrade >= 1 && childGrade <= 12;
}

export function validateChild(childName: string, childGrade: number): string | null {
  if (!isValidChildName(childName)) {
    return 'İsim 1-50 karakter arasında olmalıdır';
  }

  if (!isValidGrade(childGrade)) {
    return 'Sınıf 1-12 arasında olmalıdır';
  }

  return null;
}
