export interface Child {
  id: string
  name: string
  grade: number
  createdAt: number
}

export function createChild(name: string, grade: number): Child {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    grade,
    createdAt: Date.now()
  }
}

export function isValidChildName(name: string): boolean {
  const trimmedName = name.trim()
  return trimmedName.length > 0 && trimmedName.length <= 50
}

export function isValidGrade(grade: number): boolean {
  return Number.isInteger(grade) && grade >= 1 && grade <= 12
}

export function validateChild(name: string, grade: number): string | null {
  if (!isValidChildName(name)) {
    return "İsim 1-50 karakter arasında olmalıdır"
  }

  if (!isValidGrade(grade)) {
    return "Sınıf 1-12 arasında olmalıdır"
  }

  return null
}
