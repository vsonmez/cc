import { useAppData } from './useAppData';
import {
  getTasksByChild,
  getTasksByDate,
  getAllTasks,
  addTask as addTaskToStorage,
  updateTask as updateTaskInStorage,
  deleteTask as deleteTaskFromStorage,
  toggleTaskCompletion as toggleTaskInStorage
} from '../../core/storage';
import type { Task } from '../../core/models/task';
import type { TaskCategoryType } from '../../core/models/task-category';

export function useTasks(childId?: string) {
  const { refreshData } = useAppData();

  const tasks = childId ? getTasksByChild(childId) : getAllTasks();

  const addTask = (
    taskChildId: string,
    taskSubject: string,
    taskDescription: string,
    taskDueDate: string,
    taskCategory: TaskCategoryType = 'general_homework'
  ): Task | null => {
    const newTask = addTaskToStorage(
      taskChildId,
      taskSubject,
      taskDescription,
      taskDueDate,
      taskCategory
    );
    if (!newTask) return null;

    refreshData();
    return newTask;
  };

  const updateTask = (
    taskId: string,
    taskSubject: string,
    taskDescription: string,
    taskDueDate: string,
    taskCategory: TaskCategoryType
  ): boolean => {
    const success = updateTaskInStorage(
      taskId,
      taskSubject,
      taskDescription,
      taskDueDate,
      taskCategory
    );
    if (!success) return false;

    refreshData();
    return true;
  };

  const deleteTask = (taskId: string): boolean => {
    const success = deleteTaskFromStorage(taskId);
    if (!success) return false;

    refreshData();
    return true;
  };

  const toggleTask = (taskId: string): boolean => {
    const success = toggleTaskInStorage(taskId);
    if (!success) return false;

    refreshData();
    return true;
  };

  const getTasksForDate = (date: string): Task[] => {
    if (!childId) {
      return [];
    }
    return getTasksByDate(childId, date);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksForDate
  };
}
