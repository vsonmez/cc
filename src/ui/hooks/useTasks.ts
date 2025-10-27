import { useAppData } from './useAppData'
import {
  getTasksByChild,
  getTasksByDate,
  getAllTasks,
  addTask as addTaskToStorage,
  updateTask as updateTaskInStorage,
  deleteTask as deleteTaskFromStorage,
  toggleTaskCompletion as toggleTaskInStorage
} from '../../core/storage/repository'
import type { Task } from '../../core/models/task'

export function useTasks(childId?: string) {
  const { refreshData } = useAppData()

  const tasks = childId ? getTasksByChild(childId) : getAllTasks()

  const addTask = (
    taskChildId: string,
    subject: string,
    description: string,
    dueDate: string
  ): Task | null => {
    const newTask = addTaskToStorage(taskChildId, subject, description, dueDate)
    if (newTask) {
      refreshData()
    }
    return newTask
  }

  const updateTask = (
    taskId: string,
    subject: string,
    description: string,
    dueDate: string
  ): boolean => {
    const success = updateTaskInStorage(taskId, subject, description, dueDate)
    if (success) {
      refreshData()
    }
    return success
  }

  const deleteTask = (taskId: string): boolean => {
    const success = deleteTaskFromStorage(taskId)
    if (success) {
      refreshData()
    }
    return success
  }

  const toggleTask = (taskId: string): boolean => {
    const success = toggleTaskInStorage(taskId)
    if (success) {
      refreshData()
    }
    return success
  }

  const getTasksForDate = (date: string): Task[] => {
    if (!childId) {
      return []
    }
    return getTasksByDate(childId, date)
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksForDate
  }
}
