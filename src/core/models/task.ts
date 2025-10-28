export interface Task {
  id: string
  childId: string
  subject: string
  description: string
  dueDate: string // ISO date string (YYYY-MM-DD)
  completed: boolean
  createdAt: number
}

export function createTask(
  childId: string,
  subject: string,
  description: string,
  dueDate: string
): Task {
  return {
    id: crypto.randomUUID(),
    childId,
    subject: subject.trim(),
    description: description.trim(),
    dueDate,
    completed: false,
    createdAt: Date.now()
  }
}

export function isValidSubject(subject: string): boolean {
  const trimmedSubject = subject.trim()
  return trimmedSubject.length > 0 && trimmedSubject.length <= 30
}

export function isValidDescription(description: string): boolean {
  return description.length <= 200
}

export function isValidDueDate(dueDate: string): boolean {
  // Why: dueDate must follow YYYY-MM-DD format for consistent storage and sorting
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dueDate)) {
    return false
  }

  const parsedDate = new Date(dueDate)
  return !isNaN(parsedDate.getTime())
}

export function validateTask(
  subject: string,
  description: string,
  dueDate: string
): string | null {
  if (!isValidSubject(subject)) {
    return "Ders adı 1-30 karakter arasında olmalıdır"
  }

  if (!isValidDescription(description)) {
    return "Açıklama maksimum 200 karakter olmalıdır"
  }

  if (!isValidDueDate(dueDate)) {
    return "Geçerli bir tarih seçiniz"
  }

  return null
}
