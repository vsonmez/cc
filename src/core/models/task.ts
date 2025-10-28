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
  taskSubject: string,
  taskDescription: string,
  taskDueDate: string
): Task {
  return {
    id: crypto.randomUUID(),
    childId,
    subject: taskSubject.trim(),
    description: taskDescription.trim(),
    dueDate: taskDueDate,
    completed: false,
    createdAt: Date.now()
  }
}

export function isValidSubject(taskSubject: string): boolean {
  const trimmedSubject = taskSubject.trim()
  return trimmedSubject.length > 0 && trimmedSubject.length <= 30
}

export function isValidDescription(taskDescription: string): boolean {
  return taskDescription.length <= 200
}

export function isValidDueDate(taskDueDate: string): boolean {
  // Why: dueDate must follow YYYY-MM-DD format for consistent storage and sorting
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(taskDueDate)) {
    return false
  }

  const parsedDate = new Date(taskDueDate)
  return !isNaN(parsedDate.getTime())
}

export function validateTask(
  taskSubject: string,
  taskDescription: string,
  taskDueDate: string
): string | null {
  if (!isValidSubject(taskSubject)) {
    return "Ders adı 1-30 karakter arasında olmalıdır"
  }

  if (!isValidDescription(taskDescription)) {
    return "Açıklama maksimum 200 karakter olmalıdır"
  }

  if (!isValidDueDate(taskDueDate)) {
    return "Geçerli bir tarih seçiniz"
  }

  return null
}
