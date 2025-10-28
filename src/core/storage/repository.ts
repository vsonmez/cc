import { createChild, type Child } from '../models/child'
import { createTask, type Task } from '../models/task'
import type { Settings } from '../models/storage-schema'
import { loadAppData, saveAppData } from './storage-engine'

// ============ Children Operations ============

export function addChild(childName: string, childGrade: number): Child | null {
  const data = loadAppData()
  const newChild = createChild(childName, childGrade)

  data.children.push(newChild)

  const saveSucceeded = saveAppData(data)
  if (!saveSucceeded) {
    return null
  }

  return newChild
}

export function updateChild(childId: string, childName: string, childGrade: number): boolean {
  const data = loadAppData()
  const childIndex = data.children.findIndex(child => child.id === childId)

  if (childIndex === -1) {
    return false
  }

  data.children[childIndex] = {
    ...data.children[childIndex],
    name: childName.trim(),
    grade: childGrade
  }

  return saveAppData(data)
}

export function deleteChild(childId: string): boolean {
  const data = loadAppData()

  // Why: Remove child and all their tasks (child-centric model)
  data.children = data.children.filter(child => child.id !== childId)
  data.tasks = data.tasks.filter(task => task.childId !== childId)

  // Why: Clear last selected child if it was the deleted one
  if (data.settings.lastSelectedChildId === childId) {
    data.settings.lastSelectedChildId = null
  }

  return saveAppData(data)
}

export function getChildren(): Child[] {
  const data = loadAppData()
  // Why: Sort by createdAt so first added child appears first
  return [...data.children].sort((a, b) => a.createdAt - b.createdAt)
}

export function getChildById(childId: string): Child | null {
  const data = loadAppData()
  return data.children.find(child => child.id === childId) || null
}

// ============ Task Operations ============

export function addTask(
  childId: string,
  taskSubject: string,
  taskDescription: string,
  taskDueDate: string
): Task | null {
  const data = loadAppData()

  // Why: Guard clause - ensure child exists before adding task
  const childExists = data.children.some(child => child.id === childId)
  if (!childExists) {
    return null
  }

  const newTask = createTask(childId, taskSubject, taskDescription, taskDueDate)
  data.tasks.push(newTask)

  const saveSucceeded = saveAppData(data)
  if (!saveSucceeded) {
    return null
  }

  return newTask
}

export function updateTask(
  taskId: string,
  taskSubject: string,
  taskDescription: string,
  taskDueDate: string
): boolean {
  const data = loadAppData()
  const taskIndex = data.tasks.findIndex(task => task.id === taskId)

  if (taskIndex === -1) {
    return false
  }

  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    subject: taskSubject.trim(),
    description: taskDescription.trim(),
    dueDate: taskDueDate
  }

  return saveAppData(data)
}

export function deleteTask(taskId: string): boolean {
  const data = loadAppData()
  data.tasks = data.tasks.filter(task => task.id !== taskId)
  return saveAppData(data)
}

export function toggleTaskCompletion(taskId: string): boolean {
  const data = loadAppData()
  const taskIndex = data.tasks.findIndex(task => task.id === taskId)

  if (taskIndex === -1) {
    return false
  }

  data.tasks[taskIndex].completed = !data.tasks[taskIndex].completed

  return saveAppData(data)
}

export function getTasksByChild(childId: string): Task[] {
  const data = loadAppData()
  const childTasks = data.tasks.filter(task => task.childId === childId)

  // Why: Sort incomplete tasks first, then by due date (nearest first), then by creation time
  return childTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    if (a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate)
    }

    return b.createdAt - a.createdAt
  })
}

export function getTasksByDate(childId: string, date: string): Task[] {
  const data = loadAppData()
  return data.tasks.filter(
    task => task.childId === childId && task.dueDate === date
  )
}

export function getAllTasks(): Task[] {
  const data = loadAppData()
  return [...data.tasks]
}

// ============ Settings Operations ============

export function updateSettings(settings: Partial<Settings>): boolean {
  const data = loadAppData()
  data.settings = { ...data.settings, ...settings }
  return saveAppData(data)
}

export function getSettings(): Settings {
  const data = loadAppData()
  return { ...data.settings }
}
